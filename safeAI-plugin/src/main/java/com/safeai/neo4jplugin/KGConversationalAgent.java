package com.safeai.neo4jplugin;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.*;
import java.util.logging.Logger;
import java.util.logging.Level;
import java.io.IOException;

import org.neo4j.driver.AuthTokens;
import org.neo4j.driver.Driver;
import org.neo4j.driver.GraphDatabase;
import org.neo4j.driver.Record;
import org.neo4j.driver.Result;
import org.neo4j.driver.Session;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

public class KGConversationalAgent {
    private final String openaiApiKey;
    private final String neo4jUri;
    private final String neo4jUser;
    private final String neo4jPassword;
    private final String modelGenerate;
    private final String modelInterpret;
    private final Driver driver;
    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;
    private final Logger logger = Logger.getLogger(KGConversationalAgent.class.getName());

    public KGConversationalAgent(String modelGenerate, String modelInterpret) {
        this.openaiApiKey = System.getenv("OPENAI_API_KEY");
        if (this.openaiApiKey == null || this.openaiApiKey.isEmpty()) {
            throw new IllegalArgumentException("OPENAI_API_KEY is required");
        }
        this.neo4jUri = System.getenv("NEO4J_URI") != null ? System.getenv("NEO4J_URI") : "bolt://localhost:7687";
        this.neo4jUser = System.getenv("NEO4J_USER") != null ? System.getenv("NEO4J_USER") : "neo4j";
        this.neo4jPassword = System.getenv("NEO4J_PASSWORD") != null ? System.getenv("NEO4J_PASSWORD") : "password";
        this.modelGenerate = modelGenerate;
        this.modelInterpret = modelInterpret;
        this.driver = GraphDatabase.driver(neo4jUri, AuthTokens.basic(neo4jUser, neo4jPassword));
        this.httpClient = HttpClient.newHttpClient();
        this.objectMapper = new ObjectMapper();
        logger.info("KGConversationalAgent initialized.");
    }

    public void assertSchema() {
        String apocQuery = "CALL apoc.schema.assert({Puzzle: ['puzzle_hash'], Puzzle_Run: ['run_id'], Solution: ['solution_type']}, {})";
        try (Session session = driver.session()) {
            session.run(apocQuery);
            logger.info("Schema assertions executed via APOC.");
        } catch (Exception e) {
            logger.log(Level.SEVERE, "Error asserting schema: " + e.getMessage(), e);
        }
    }

    public List<Map<String, Object>> runQuery(String query) {
        try (Session session = driver.session()) {
            Result result = session.run(query);
            List<Map<String, Object>> records = new ArrayList<>();
            while (result.hasNext()) {
                Record record = result.next();
                records.add(record.asMap());
            }
            logger.info("Cypher query executed successfully.");
            return records;
        } catch (Exception e) {
            logger.log(Level.SEVERE, "Error running query: " + e.getMessage(), e);
            throw e;
        }
    }

    public String generateCypherQuery(String prompt) {
        String context = "You are an expert in Neo4j and ARC puzzle solving. The graph contains Puzzle, Puzzle_Run, and Solution nodes with appropriate indexes. " +
                "When translating a natural language request into a Cypher query, output only the raw Cypher query code. " +
                "If the request asks to describe or list the schema, use the APOC procedure 'CALL apoc.meta.schema()' to return the schema information.";
        List<Map<String, String>> messages = new ArrayList<>();
        Map<String, String> systemMessage = new HashMap<>();
        systemMessage.put("role", "system");
        systemMessage.put("content", context);
        Map<String, String> userMessage = new HashMap<>();
        userMessage.put("role", "user");
        userMessage.put("content", "Translate this request into a Cypher query for Neo4j: " + prompt);
        messages.add(systemMessage);
        messages.add(userMessage);
        Map<String, Object> payload = new HashMap<>();
        payload.put("model", modelGenerate);
        payload.put("messages", messages);
        payload.put("temperature", 0.7);
        String payloadJson;
        try {
            payloadJson = objectMapper.writeValueAsString(payload);
        } catch (IOException e) {
            logger.log(Level.SEVERE, "Error serializing payload: " + e.getMessage(), e);
            return "";
        }
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://api.openai.com/v1/chat/completions"))
                .header("Content-Type", "application/json")
                .header("Authorization", "Bearer " + openaiApiKey)
                .POST(HttpRequest.BodyPublishers.ofString(payloadJson))
                .build();
        try {
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() != 200) {
                logger.severe("Non-200 response from OpenAI: " + response.body());
                return "";
            }
            JsonNode root = objectMapper.readTree(response.body());
            String rawResponse = root.get("choices").get(0).get("message").get("content").asText().trim();
            if (rawResponse.contains("```")) {
                int first = rawResponse.indexOf("```");
                int second = rawResponse.indexOf("```");
                if (first != -1 && second != -1 && second > first) {
                    rawResponse = rawResponse.substring(first + 3, second).trim();
                }
            }
            if (prompt.toLowerCase().contains("describe") && prompt.toLowerCase().contains("schema")) {
                rawResponse = "CALL apoc.meta.schema()";
            }
            logger.info("Generated Cypher query from prompt.");
            return rawResponse;
        } catch (Exception e) {
            logger.log(Level.SEVERE, "Error generating Cypher query: " + e.getMessage(), e);
            return "";
        }
    }

    public String interpretResults(Object neo4jResults) {
        String interpretationPrompt = "Explain these Neo4j results in plain language: " + neo4jResults.toString();
        List<Map<String, String>> messages = new ArrayList<>();
        Map<String, String> systemMsg = new HashMap<>();
        systemMsg.put("role", "system");
        systemMsg.put("content", "You are a data analysis expert.");
        Map<String, String> userMsg = new HashMap<>();
        userMsg.put("role", "user");
        userMsg.put("content", interpretationPrompt);
        messages.add(systemMsg);
        messages.add(userMsg);
        Map<String, Object> payload = new HashMap<>();
        payload.put("model", modelInterpret);
        payload.put("messages", messages);
        payload.put("temperature", 0.7);
        String payloadJson;
        try {
            payloadJson = objectMapper.writeValueAsString(payload);
        } catch (IOException e) {
            logger.log(Level.SEVERE, "Error serializing payload: " + e.getMessage(), e);
            return "";
        }
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://api.openai.com/v1/chat/completions"))
                .header("Content-Type", "application/json")
                .header("Authorization", "Bearer " + openaiApiKey)
                .POST(HttpRequest.BodyPublishers.ofString(payloadJson))
                .build();
        try {
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() != 200) {
                logger.severe("Non-200 response from OpenAI: " + response.body());
                return "";
            }
            JsonNode root = objectMapper.readTree(response.body());
            String interpretation = root.get("choices").get(0).get("message").get("content").asText().trim();
            logger.info("Interpreted Neo4j results successfully.");
            return interpretation;
        } catch (Exception e) {
            logger.log(Level.SEVERE, "Error interpreting results: " + e.getMessage(), e);
            return "";
        }
    }

    public String processQuery(String userInput) {
        try {
            String cypherQuery = generateCypherQuery(userInput);
            System.out.println("\nGenerated Cypher Query:");
            System.out.println(cypherQuery);
            List<Map<String, Object>> neo4jResults = runQuery(cypherQuery);
            System.out.println("\nNeo4j Raw Results:");
            try {
                String resultsJson = objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(neo4jResults);
                System.out.println(resultsJson);
            } catch (IOException e) {
                System.out.println(neo4jResults.toString());
            }
            String interpretation = interpretResults(neo4jResults);
            return interpretation;
        } catch (Exception e) {
            logger.log(Level.SEVERE, "Error processing user query: " + e.getMessage(), e);
            return "An error occurred: " + e.getMessage();
        }
    }

    public void checkStatus() {
        String statusQuery = "MATCH (s:Solution) RETURN s.solution_type AS solutionType, COUNT(*) AS count";
        try {
            List<Map<String, Object>> results = runQuery(statusQuery);
            System.out.println("\nStatus Query Results:");
            String resultsJson = objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(results);
            System.out.println(resultsJson);
            String advicePrompt = "In my ARC puzzle solver KG, I have the following counts for solution nodes: " + resultsJson 
                    + ". 'AI_Solved' indicates puzzles solved successfully, and 'Counterexample' indicates failures. "
                    + "Based on these numbers, please provide advice on what might be going wrong and how I could adjust my system to fix it.";
            List<Map<String, String>> messages = new ArrayList<>();
            Map<String, String> systemMsg = new HashMap<>();
            systemMsg.put("role", "system");
            systemMsg.put("content", "You are an expert in machine learning and knowledge graphs.");
            Map<String, String> userMsg = new HashMap<>();
            userMsg.put("role", "user");
            userMsg.put("content", advicePrompt);
            messages.add(systemMsg);
            messages.add(userMsg);
            Map<String, Object> payload = new HashMap<>();
            payload.put("model", modelInterpret);
            payload.put("messages", messages);
            payload.put("temperature", 0.7);
            String payloadJson = objectMapper.writeValueAsString(payload);
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.openai.com/v1/chat/completions"))
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + openaiApiKey)
                    .POST(HttpRequest.BodyPublishers.ofString(payloadJson))
                    .build();
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() != 200) {
                logger.severe("Non-200 response from OpenAI: " + response.body());
                return;
            }
            JsonNode root = objectMapper.readTree(response.body());
            String advice = root.get("choices").get(0).get("message").get("content").asText().trim();
            System.out.println("\nAdvice from LLM:");
            System.out.println(advice);
        } catch (Exception e) {
            logger.log(Level.SEVERE, "Error checking status: " + e.getMessage(), e);
        }
    }

    public void interactiveShell() {
        System.out.println("Welcome to the Professional ARC Puzzle Solver KG Interactive Shell!");
        System.out.println("Enter natural language queries about the KG, or type 'status' to check solution counts.");
        System.out.println("Type 'quit' or 'exit' to close the session.\n");
        assertSchema();
        Scanner scanner = new Scanner(System.in);
        while (true) {
            System.out.print("Your Query: ");
            String userInput = scanner.nextLine().trim();
            if (userInput.equalsIgnoreCase("quit") || userInput.equalsIgnoreCase("exit")) {
                break;
            } else if (userInput.equalsIgnoreCase("status")) {
                checkStatus();
            } else {
                String interpretation = processQuery(userInput);
                System.out.println("\nResponse from KG interpretation:");
                System.out.println(interpretation);
            }
            System.out.println("\n" + "=".repeat(50) + "\n");
        }
        scanner.close();
        driver.close();
        System.out.println("Goodbye!");
    }

    public static void main(String[] args) {
        KGConversationalAgent agent = new KGConversationalAgent("o3-mini", "gpt-4o-mini");
        try {
            agent.interactiveShell();
        } catch (Exception e) {
            System.out.println("Session terminated: " + e.getMessage());
        } finally {
            agent.driver.close();
        }
    }
}
