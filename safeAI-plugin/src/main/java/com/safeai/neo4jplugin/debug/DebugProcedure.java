package com.safeai.neo4jplugin.debug;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Stream;

import org.json.JSONArray;
import org.json.JSONObject;
import org.neo4j.graphdb.GraphDatabaseService;
import org.neo4j.graphdb.Transaction;
import org.neo4j.procedure.Context;
import org.neo4j.procedure.Description;
import org.neo4j.procedure.Mode;
import org.neo4j.procedure.Name;
import org.neo4j.procedure.Procedure;
import com.safeai.neo4jplugin.graph_rag.GraphRAG;
import com.safeai.neo4jplugin.DynamicAgentCreator;

public class DebugProcedure {
    @Context 
    public GraphDatabaseService db;

    public static class StringResult {
        public String value;
        public StringResult(String value) {
            this.value = value;
        }
    }

    @Procedure(name = "safeai.debug.listKGFiles", mode = Mode.READ)
    @Description("Lists all Knowledge Graph JSON files in the resources folder")
    public Stream<StringResult> listKGFiles() {
        List<StringResult> results = new ArrayList<>();
        try {
            ClassLoader classLoader = getClass().getClassLoader();
            String[] kgFiles = getKGFiles();

            int foundCount = 0;
            for (String kgFile : kgFiles) {
                InputStream is = classLoader.getResourceAsStream(kgFile);
                if (is != null) {
                    foundCount++;
                    results.add(new StringResult("Found KG file: " + kgFile));
                    is.close();
                } else {
                    results.add(new StringResult("KG file not found: " + kgFile));
                }
            }
            results.add(new StringResult("Total KG files found: " + foundCount));
            if (foundCount == 0) {
                results.add(new StringResult("No KG files found in resources"));
            }
        } catch (Exception e) {
            results.add(new StringResult("Error: " + e.getMessage()));
        }
        return results.stream();
    }

    private String[] getKGFiles() {
        return new String[] {
            "CyberSecurity_KG.json",
            "DataPrivacySecurity_KG.json",
            "EnergyManagement_KG.json",
            "EnvironmentalSustainability_KG.json",
            "Ethics_KG.json",
            "FinancialAnalytics_KG.json",
            "FreePress_KG.json",
            "Internal_KG.json",
            "LegalCompliance_KG.json",
            "Math_KG.json",
            "MedicalSafety_KG.json",
            "PersonalizedLearning_KG.json",
            "RiskManagement_KG.json",
            "SmartCityAnalytics_KG.json",
            "SupplyChainManagement_KG.json",
            "UserBehaviorTrust_KG.json",
            "VirtualAssistant_KG.json",
            "VirtualMoralEthicalSoldier_KG.json",
            "VirtualPoliceOfficer_KG.json",
            "ARC_Puzzle_Agent_Definitions_KG.json"
        };
    }

    @Procedure(name = "safeai.debug.loadKGFiles", mode = Mode.WRITE)
    @Description("Loads all KG JSON files from resources, creates KnowledgeGraph nodes with proper relationships")
    public Stream<StringResult> loadKGFiles() {
        List<StringResult> results = new ArrayList<>();
        try {
            // Delete existing nodes to avoid duplicates
            try (Transaction tx = db.beginTx()) {
                tx.execute("MATCH (n) WHERE n:KnowledgeGraph OR n:Agent OR n:Capability OR n:Relationship DETACH DELETE n");
                tx.commit();
                results.add(new StringResult("Cleaned existing nodes"));
            }

            ClassLoader classLoader = getClass().getClassLoader();
            String[] kgFiles = getKGFiles();

            int loadedCount = 0;
            for (String kgFile : kgFiles) {
                InputStream is = classLoader.getResourceAsStream(kgFile);
                if (is != null) {
                    try {
                        // Read and parse KG file
                        BufferedReader reader = new BufferedReader(new InputStreamReader(is));
                        StringBuilder contentBuilder = new StringBuilder();
                        String line;
                        while ((line = reader.readLine()) != null) {
                            contentBuilder.append(line);
                        }
                        String jsonStr = contentBuilder.toString();
                        JSONObject jsonObj = new JSONObject(jsonStr);
                        
                        // Validate KG structure
                        if (!validateKGStructure(jsonObj)) {
                            results.add(new StringResult("Invalid KG structure in " + kgFile));
                            continue;
                        }

                        String domainName = jsonObj.has("domain") ? jsonObj.getString("domain")
                                : kgFile.replace("_KG.json", "");

                        try (Transaction tx = db.beginTx()) {
                            // Create KG node with full content
                            tx.execute(
                                "CREATE (kg:KnowledgeGraph {name: $name, description: $description, content: $content, created_at: datetime()})",
                                Map.of(
                                    "name", domainName,
                                    "description", jsonObj.optString("description", "Agentic Knowledge Graph for " + domainName),
                                    "content", jsonStr
                                )
                            );

                            // Process capabilities if present
                            if (jsonObj.has("capabilities")) {
                                JSONArray capabilities = jsonObj.getJSONArray("capabilities");
                                for (int i = 0; i < capabilities.length(); i++) {
                                    JSONObject capObj = capabilities.getJSONObject(i);
                                    Map<String, Object> capProps = new HashMap<>();
                                    for (String key : capObj.keySet()) {
                                        capProps.put(key, convertJson(capObj.get(key)));
                                    }
                                    capProps.put("created_at", "datetime()");
                                    
                                    tx.execute(
                                        "MATCH (kg:KnowledgeGraph {name: $kgName}) " +
                                        "CREATE (c:Capability) SET c = $props " +
                                        "CREATE (kg)-[:HAS_CAPABILITY]->(c)",
                                        Map.of("kgName", domainName, "props", capProps)
                                    );
                                }
                            }

                            // Process agents with capabilities
                            if (jsonObj.has("agents")) {
                                JSONArray agents = jsonObj.getJSONArray("agents");
                                for (int i = 0; i < agents.length(); i++) {
                                    JSONObject agentObj = agents.getJSONObject(i);
                                    Map<String, Object> agentProps = new HashMap<>();
                                    for (String key : agentObj.keySet()) {
                                        if (!key.equals("capabilities")) {
                                            agentProps.put(key, convertJson(agentObj.get(key)));
                                        }
                                    }
                                    agentProps.put("kgName", domainName);
                                    agentProps.put("created_at", "datetime()");

                                    // Create agent node
                                    tx.execute(
                                        "MATCH (kg:KnowledgeGraph {name: $kgName}) " +
                                        "CREATE (a:Agent) SET a = $props " +
                                        "CREATE (kg)-[:HAS_AGENT]->(a)",
                                        Map.of("kgName", domainName, "props", agentProps)
                                    );

                                    // Link agent to capabilities
                                    if (agentObj.has("capabilities")) {
                                        JSONArray agentCaps = agentObj.getJSONArray("capabilities");
                                        for (int j = 0; j < agentCaps.length(); j++) {
                                            String capName = agentCaps.getString(j);
                                            tx.execute(
                                                "MATCH (a:Agent {name: $agentName}), (c:Capability {name: $capName}) " +
                                                "CREATE (a)-[:HAS_CAPABILITY]->(c)",
                                                Map.of("agentName", agentProps.get("name"), "capName", capName)
                                            );
                                        }
                                    }
                                }
                            }

                            // Process relationships if present
                            if (jsonObj.has("relationships")) {
                                JSONArray relationships = jsonObj.getJSONArray("relationships");
                                for (int i = 0; i < relationships.length(); i++) {
                                    JSONObject relObj = relationships.getJSONObject(i);
                                    tx.execute(
                                        "MATCH (from {name: $fromName}), (to {name: $toName}) " +
                                        "CREATE (from)-[:RELATES_TO {type: $type, description: $description}]->(to)",
                                        Map.of(
                                            "fromName", relObj.getString("from"),
                                            "toName", relObj.getString("to"),
                                            "type", relObj.getString("type"),
                                            "description", relObj.optString("description", "")
                                        )
                                    );
                                }
                            }

                            tx.commit();
                            loadedCount++;
                            results.add(new StringResult("Successfully loaded KG: " + domainName));
                        }
                    } catch (Exception e) {
                        results.add(new StringResult("Error processing " + kgFile + ": " + e.getMessage()));
                        e.printStackTrace();
                    } finally {
                        is.close();
                    }
                }
            }
            results.add(new StringResult("Total KGs loaded: " + loadedCount));
        } catch (Exception e) {
            results.add(new StringResult("Error: " + e.getMessage()));
            e.printStackTrace();
        }
        return results.stream();
    }

    private boolean validateKGStructure(JSONObject kg) {
        // Required fields
        if (!kg.has("domain") && !kg.has("name")) {
            return false;
        }

        // Validate agents if present
        if (kg.has("agents")) {
            JSONArray agents = kg.getJSONArray("agents");
            for (int i = 0; i < agents.length(); i++) {
                JSONObject agent = agents.getJSONObject(i);
                if (!agent.has("name") || !agent.has("description")) {
                    return false;
                }
            }
        }

        // Validate capabilities if present
        if (kg.has("capabilities")) {
            JSONArray capabilities = kg.getJSONArray("capabilities");
            for (int i = 0; i < capabilities.length(); i++) {
                JSONObject capability = capabilities.getJSONObject(i);
                if (!capability.has("name") || !capability.has("description")) {
                    return false;
                }
            }
        }

        // Validate relationships if present
        if (kg.has("relationships")) {
            JSONArray relationships = kg.getJSONArray("relationships");
            for (int i = 0; i < relationships.length(); i++) {
                JSONObject relationship = relationships.getJSONObject(i);
                if (!relationship.has("from") || !relationship.has("to") || !relationship.has("type")) {
                    return false;
                }
            }
        }

        return true;
    }

    @Procedure(name = "safeai.debug.hello", mode = Mode.READ)
    @Description("Test procedure that returns a greeting")
    public Stream<StringResult> hello(@Name("name") String name) {
        System.out.println("Debug procedure called with: " + name);
        return Stream.of(new StringResult("Hello, " + name + "!"));
    }

    @Procedure(name = "safeai.debug.testGroovyIntegration", mode = Mode.READ)
    @Description("Tests dynamic Groovy agent integration independently after loadKG. Creates a Groovy agent and calls generate_candidate")
    public Stream<StringResult> testGroovyIntegration() {
        List<StringResult> results = new ArrayList<>();
        try {
            GraphRAG dummyGraph = new GraphRAG("dummy", "dummy", "dummy");
            JSONObject agentDef = new JSONObject();
            agentDef.put("name", "GroovyAgentTest");
            agentDef.put("description", "Test dynamic Groovy agent integration independently");
            String groovyScript = "import com.safeai.neo4jplugin.graph_rag.GraphRAG\n" +
                "class GroovyAgent {\n" +
                "  public List generate_candidate(List puzzleGrid) {\n" +
                "    def rotated = []\n" +
                "    for (int c = 0; c < puzzleGrid[0].size(); c++) {\n" +
                "      def newRow = []\n" +
                "      for (int r = puzzleGrid.size()-1; r >= 0; r--) {\n" +
                "        newRow.add(puzzleGrid[r][c])\n" +
                "      }\n" +
                "      rotated.add(newRow)\n" +
                "    }\n" +
                "    return rotated\n" +
                "  }\n" +
                "}\n" +
                "return new GroovyAgent()";
            agentDef.put("groovyScript", groovyScript);
            agentDef.put("blockchainIntegration", false);
            Object agentInstance = DynamicAgentCreator.createAgent(agentDef, dummyGraph);
            java.util.List<java.util.List<Integer>> puzzleGrid = java.util.Arrays.asList(
                java.util.Arrays.asList(1, 2, 3),
                java.util.Arrays.asList(4, 5, 6),
                java.util.Arrays.asList(7, 8, 9)
            );
            java.lang.reflect.Method method = agentInstance.getClass().getDeclaredMethod("generate_candidate", java.util.List.class);
            method.setAccessible(true);
            Object candidate = method.invoke(agentInstance, puzzleGrid);
            results.add(new StringResult("Groovy Integration Test Output: " + candidate.toString()));
        } catch (Exception e) {
            results.add(new StringResult("Groovy Integration Test Error: " + e.getMessage()));
        }
        return results.stream();
    }

    @Procedure(name = "safeai.debug.testLLMIntegration", mode = Mode.READ)
    @Description("Tests dynamic LLM agent integration independently after loadKG. Creates an LLM agent and calls generate_candidate")
    public Stream<StringResult> testLLMIntegration() {
        List<StringResult> results = new ArrayList<>();
        try {
            GraphRAG dummyGraph = new GraphRAG("dummy", "dummy", "dummy");
            JSONObject agentDef = new JSONObject();
            agentDef.put("name", "LLMAgentTest");
            agentDef.put("description", "Test dynamic LLM agent integration independently");
            agentDef.put("llmPrompt", "Hardcoded prompt for LLM test");
            agentDef.put("blockchainIntegration", false);
            Object agentInstance = DynamicAgentCreator.createAgent(agentDef, dummyGraph);
            java.util.List<java.util.List<Integer>> puzzleGrid = java.util.Arrays.asList(
                java.util.Arrays.asList(1, 2, 3),
                java.util.Arrays.asList(4, 5, 6),
                java.util.Arrays.asList(7, 8, 9)
            );
            java.lang.reflect.Method method = agentInstance.getClass().getDeclaredMethod("generate_candidate", java.util.List.class);
            method.setAccessible(true);
            Object candidate = method.invoke(agentInstance, puzzleGrid);
            String candidateStr = (candidate != null ? candidate.toString() : "Simulated LLM response (null)");
            results.add(new StringResult("LLM Integration Test Output: " + candidateStr));
        } catch(Exception e) {
            results.add(new StringResult("LLM Integration Test Error: " + (e.getMessage() != null ? e.getMessage() : e.toString())));
        }
        return results.stream();
    }

    @Procedure(name = "safeai.debug.installAll", mode = Mode.READ)
    @Description("Performs complete installation: sets API keys, and tests Groovy, LLM, and Blockchain integration.")
    public Stream<StringResult> installAll() {
        List<StringResult> results = new ArrayList<>();
        try {
            String key = System.getenv("OPENAI_API_KEY");
            if(key == null || key.isEmpty()){
                key = System.getProperty("OPENAI_API_KEY");
            }
            if(key == null || key.isEmpty()){
                System.setProperty("OPENAI_API_KEY", "test-api-key");
                results.add(new StringResult("OPENAI_API_KEY was not set. Temporarily setting it to 'test-api-key' for integration testing."));
            } else {
                results.add(new StringResult("OPENAI_API_KEY is set."));
            }
            try {
                com.safeai.neo4jplugin.LLMClient llmClient = new com.safeai.neo4jplugin.LLMClient();
                com.safeai.neo4jplugin.LLMClient.QueryResult qr = llmClient.query_llm_schema("dummy query", "dummy-model");
                results.add(new StringResult("LLM Integration Test Output: " + qr.solution_text));
            } catch(Exception e) {
                results.add(new StringResult("LLM Integration Test Error: " + (e.getCause() != null && e.getCause().getMessage() != null ? e.getCause().getMessage() : (e.getMessage() != null ? e.getMessage() : e.toString()))));
            }
            try {
                com.safeai.neo4jplugin.blockchain.BlockchainConnector.initialize("http://blockchain.example.com/api");
                if(com.safeai.neo4jplugin.blockchain.BlockchainConnector.getWeb3j() != null){
                    results.add(new StringResult("Blockchain Integration Test Output: Successfully connected."));
                } else {
                    results.add(new StringResult("Blockchain Integration Test Error: Connection failed."));
                }
            } catch(Exception e) {
                results.add(new StringResult("Blockchain Integration Test Error: " + e.getMessage()));
            }
            try {
                com.safeai.neo4jplugin.graph_rag.GraphRAG dummyGraph = new com.safeai.neo4jplugin.graph_rag.GraphRAG("dummy", "dummy", "dummy");
                org.json.JSONObject agentDef = new org.json.JSONObject();
                agentDef.put("name", "GroovyAgentTest");
                agentDef.put("description", "Test dynamic Groovy agent integration independently");
                String groovyScript = "import com.safeai.neo4jplugin.graph_rag.GraphRAG\n" +
                    "class GroovyAgent {\n" +
                    "  public List generate_candidate(List puzzleGrid) {\n" +
                    "    def rotated = []\n" +
                    "    for (int c = 0; c < puzzleGrid[0].size(); c++) {\n" +
                    "      def newRow = []\n" +
                    "      for (int r = puzzleGrid.size()-1; r >= 0; r--) {\n" +
                    "        newRow.add(puzzleGrid[r][c])\n" +
                    "      }\n" +
                    "      rotated.add(newRow)\n" +
                    "    }\n" +
                    "    return rotated\n" +
                    "  }\n" +
                    "}\n" +
                    "return new GroovyAgent()";
                agentDef.put("groovyScript", groovyScript);
                agentDef.put("blockchainIntegration", false);
                Object agentInstance = com.safeai.neo4jplugin.DynamicAgentCreator.createAgent(agentDef, dummyGraph);
                java.util.List<java.util.List<Integer>> puzzleGrid = java.util.Arrays.asList(
                    java.util.Arrays.asList(1, 2, 3),
                    java.util.Arrays.asList(4, 5, 6),
                    java.util.Arrays.asList(7, 8, 9)
                );
                java.lang.reflect.Method method = agentInstance.getClass().getDeclaredMethod("generate_candidate", java.util.List.class);
                method.setAccessible(true);
                Object candidate = method.invoke(agentInstance, puzzleGrid);
                results.add(new StringResult("Groovy Integration Test Output: " + candidate.toString()));
            } catch(Exception e) {
                results.add(new StringResult("Groovy Integration Test Error: " + e.getMessage()));
            }
        } catch(Exception e) {
            results.add(new StringResult("Installation procedure Error: " + e.getMessage()));
        }
        return results.stream();
    }

    private Object convertJson(Object o) {
        if (o instanceof JSONArray) {
            List<Object> list = new ArrayList<>();
            JSONArray arr = (JSONArray) o;
            for (int i = 0; i < arr.length(); i++) {
                list.add(convertJson(arr.get(i)));
            }
            return list;
        } else if (o instanceof JSONObject) {
            Map<String, Object> map = new HashMap<>();
            JSONObject obj = (JSONObject) o;
            for (String key : obj.keySet()) {
                map.put(key, convertJson(obj.get(key)));
            }
            return map;
        } else {
            return o;
        }
    }
}
