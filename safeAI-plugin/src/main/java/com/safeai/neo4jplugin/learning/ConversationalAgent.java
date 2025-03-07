package com.safeai.neo4jplugin.learning;

import com.safeai.neo4jplugin.LLMClient;
import com.safeai.neo4jplugin.graph_rag.GraphRAG;
import java.util.Scanner;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.util.concurrent.CompletableFuture;

/**
 * ConversationalAgent provides an interactive, natural language interface for querying the learning KG.
 */
public class ConversationalAgent {
    private static final Logger logger = LogManager.getLogger(ConversationalAgent.class);
    private GraphRAG graphRag;
    private LLMClient llmClient;

    public ConversationalAgent(GraphRAG graphRag) {
        this.graphRag = graphRag;
        this.llmClient = new LLMClient();
    }


    /**
     * Asynchronously starts a conversation with a query and returns the response.
     */
    public CompletableFuture<String> startConversation(String query) {
        return CompletableFuture.supplyAsync(() -> {
            return llmClient.query_llm_schema(query, "gpt4o-mini").solution_text;
        });
    }

    /**
     * Starts an interactive session for querying the learning KG.
     */
    public void startConversation() {
        Scanner scanner = new Scanner(System.in);
        System.out.println("Welcome to the SafeAI Learning KG Conversational Interface!");
        System.out.println("Type your query, or 'quit' to exit.");
        while (true) {
            System.out.print("Your Query: ");
            String input = scanner.nextLine();
            if (input.equalsIgnoreCase("quit") || input.equalsIgnoreCase("exit")) {
                break;
            }
            // Generate a Cypher query using the LLMClient
            String cypherQuery = llmClient.query_llm_schema(input, "gpt4o-mini").solution_text;
            System.out.println("Generated Query: " + cypherQuery);
            // In a complete implementation, the query would be executed and the result interpreted.
        }
        scanner.close();
        logger.info("Conversational session ended.");
    }
}
