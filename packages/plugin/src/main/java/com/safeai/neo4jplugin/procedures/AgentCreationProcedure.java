package com.safeai.neo4jplugin.procedures;

import org.neo4j.graphdb.GraphDatabaseService;
import org.neo4j.graphdb.Transaction;
import org.neo4j.procedure.*;
import org.json.JSONObject;
import com.safeai.neo4jplugin.LLMClient;
import java.util.stream.Stream;
import java.util.Map;
import java.util.HashMap;

public class AgentCreationProcedure {
    @Context
    public GraphDatabaseService db;

    public static class AgentResult {
        public final String value;
        public final Map<String, Object> agent;

        public AgentResult(String value, Map<String, Object> agent) {
            this.value = value;
            this.agent = agent;
        }
    }

    @Procedure(name = "safeai.agents.createFromDescription", mode = Mode.WRITE)
    @Description("Creates an agent from a natural language description")
    public Stream<AgentResult> createFromDescription(
            @Name("description") String description,
            @Name(value = "type", defaultValue = "llm") String type) {
        
        try {
            // Generate agent definition using LLM
            LLMClient llm = new LLMClient();
            String prompt = String.format(
                "Create a SafeAI agent definition based on this description: '%s'\n" +
                "The agent should be of type: %s\n" +
                "Include:\n" +
                "- A clear name and category\n" +
                "- Detailed description\n" +
                "- Required capabilities\n" +
                "- Effectiveness threshold\n" +
                "- Ethics guidelines\n" +
                "- Security validation requirements\n" +
                "If type is 'groovy', include Groovy script code. If type is 'llm', include LLM prompt template.\n" +
                "Format as JSON.", description, type);

            LLMClient.QueryResult result = llm.query_llm_schema(prompt, "o3-mini");
            JSONObject agentDef = new JSONObject(result.solution_text);

            // Validate the generated definition
            String validationPrompt = String.format(
                "Validate this SafeAI agent definition for security and effectiveness:\n%s\n" +
                "Check:\n" +
                "1. Security vulnerabilities\n" +
                "2. Ethical compliance\n" +
                "3. Performance implications\n" +
                "4. Resource usage\n" +
                "5. Code/prompt safety\n" +
                "Return JSON with 'valid' (boolean) and 'feedback' (string) fields.", 
                agentDef.toString());

            LLMClient.QueryResult validation = llm.query_llm_schema(validationPrompt, "o3-mini");
            JSONObject validationResult = new JSONObject(validation.solution_text);

            if (!validationResult.getBoolean("valid")) {
                return Stream.of(new AgentResult(
                    "Agent validation failed: " + validationResult.getString("feedback"),
                    null
                ));
            }

            // Create agent node in the database
            Map<String, Object> agentNode = new HashMap<>();
            try (Transaction tx = db.beginTx()) {
                agentNode.put("name", agentDef.getString("name"));
                agentNode.put("category", agentDef.getString("category"));
                agentNode.put("description", agentDef.getString("description"));
                agentNode.put("agent_type", type);
                agentNode.put("effectiveness_threshold", agentDef.getDouble("effectiveness_threshold"));
                agentNode.put("ethics_guidelines", agentDef.getString("ethics_guidelines"));
                
                if (type.equals("groovy")) {
                    agentNode.put("agent_code", agentDef.getString("groovy_script"));
                } else {
                    agentNode.put("llm_prompt", agentDef.getString("llm_prompt"));
                }

                // Add security settings
                agentNode.put("security_input_validation", true);
                agentNode.put("security_resource_monitoring", true);
                agentNode.put("security_output_validation", true);

                // Create the node
                tx.execute(
                    "CREATE (a:Agent) SET a = $props RETURN a",
                    Map.of("props", agentNode)
                );

                // Add capabilities
                if (agentDef.has("capabilities")) {
                    for (Object cap : agentDef.getJSONArray("capabilities")) {
                        String capability = (String) cap;
                        tx.execute(
                            "MATCH (a:Agent {name: $name}) " +
                            "MERGE (c:Capability {name: $capability}) " +
                            "CREATE (a)-[:HAS_CAPABILITY]->(c)",
                            Map.of("name", agentDef.getString("name"), 
                                  "capability", capability)
                        );
                    }
                }

                tx.commit();
            }

            return Stream.of(new AgentResult(
                "Successfully created agent: " + agentDef.getString("name"),
                agentNode
            ));

        } catch (Exception e) {
            return Stream.of(new AgentResult(
                "Error creating agent: " + e.getMessage(),
                null
            ));
        }
    }

    @Procedure(name = "safeai.agents.validateAgent", mode = Mode.READ)
    @Description("Validates an existing agent's configuration and code/prompt")
    public Stream<AgentResult> validateAgent(@Name("agentName") String agentName) {
        try {
            Map<String, Object> agent;
            try (Transaction tx = db.beginTx()) {
                var result = tx.execute(
                    "MATCH (a:Agent {name: $name}) RETURN a",
                    Map.of("name", agentName)
                );
                
                if (!result.hasNext()) {
                    return Stream.of(new AgentResult("Agent not found: " + agentName, null));
                }

                agent = (Map<String, Object>) result.next().get("a");
            }

            // Validate the agent using LLM
            LLMClient llm = new LLMClient();
            String validationPrompt = String.format(
                "Validate this SafeAI agent configuration for security and effectiveness:\n%s\n" +
                "Check:\n" +
                "1. Security vulnerabilities\n" +
                "2. Ethical compliance\n" +
                "3. Performance implications\n" +
                "4. Resource usage\n" +
                "5. Code/prompt safety\n" +
                "Return JSON with 'valid' (boolean) and 'feedback' (string) fields.",
                new JSONObject(agent).toString());

            LLMClient.QueryResult validation = llm.query_llm_schema(validationPrompt, "o3-mini");
            JSONObject validationResult = new JSONObject(validation.solution_text);

            return Stream.of(new AgentResult(
                validationResult.getBoolean("valid") 
                    ? "Agent validation successful" 
                    : "Agent validation failed: " + validationResult.getString("feedback"),
                agent
            ));

        } catch (Exception e) {
            return Stream.of(new AgentResult(
                "Error validating agent: " + e.getMessage(),
                null
            ));
        }
    }
} 