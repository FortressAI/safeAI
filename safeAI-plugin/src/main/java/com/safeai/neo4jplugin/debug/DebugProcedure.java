package com.safeai.neo4jplugin.debug;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Stream;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

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
import org.neo4j.graphdb.Result;
import org.neo4j.graphdb.Node;

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

    @Procedure(name = "safeai.debug.validateSecurity", mode = Mode.READ)
    @Description("Validates security and compliance of loaded Knowledge Graphs")
    public Stream<StringResult> validateSecurity() {
        List<StringResult> results = new ArrayList<>();
        try {
            // Check for required security KGs
            try (Transaction tx = db.beginTx()) {
                Result securityKGs = tx.execute(
                    "MATCH (kg:KnowledgeGraph) " +
                    "WHERE kg.name IN ['CyberSecurity', 'DataPrivacySecurity', 'LegalCompliance', 'RiskManagement'] " +
                    "RETURN kg.name as name, kg.description as description"
                );
                
                if (!securityKGs.hasNext()) {
                    results.add(new StringResult("WARNING: Required security KGs are missing"));
                } else {
                    while (securityKGs.hasNext()) {
                        Map<String, Object> record = securityKGs.next();
                        results.add(new StringResult("Found security KG: " + record.get("name")));
                    }
                }
            }

            // Verify agent security capabilities
            try (Transaction tx = db.beginTx()) {
                Result agentSecurity = tx.execute(
                    "MATCH (a:Agent)-[:HAS_CAPABILITY]->(c:Capability) " +
                    "WHERE c.name CONTAINS 'security' OR c.name CONTAINS 'compliance' " +
                    "RETURN a.name as agent, collect(c.name) as security_capabilities"
                );
                
                if (!agentSecurity.hasNext()) {
                    results.add(new StringResult("WARNING: No agents found with security capabilities"));
                } else {
                    while (agentSecurity.hasNext()) {
                        Map<String, Object> record = agentSecurity.next();
                        results.add(new StringResult("Agent " + record.get("agent") + 
                            " has security capabilities: " + record.get("security_capabilities")));
                    }
                }
            }

            // Check compliance requirements
            try (Transaction tx = db.beginTx()) {
                Result compliance = tx.execute(
                    "MATCH (kg:KnowledgeGraph)-[:HAS_CAPABILITY]->(c:Capability) " +
                    "WHERE c.name CONTAINS 'compliance' " +
                    "RETURN kg.name as kg, collect(c.name) as compliance_capabilities"
                );
                
                if (!compliance.hasNext()) {
                    results.add(new StringResult("WARNING: No compliance capabilities found"));
                } else {
                    while (compliance.hasNext()) {
                        Map<String, Object> record = compliance.next();
                        results.add(new StringResult("KG " + record.get("kg") + 
                            " has compliance capabilities: " + record.get("compliance_capabilities")));
                    }
                }
            }

            // Verify blockchain integration
            try (Transaction tx = db.beginTx()) {
                Result blockchain = tx.execute(
                    "MATCH (a:Agent) " +
                    "WHERE a.blockchainIntegration = true " +
                    "RETURN a.name as agent, a.description as description"
                );
                
                if (!blockchain.hasNext()) {
                    results.add(new StringResult("WARNING: No agents found with blockchain integration"));
                } else {
                    while (blockchain.hasNext()) {
                        Map<String, Object> record = blockchain.next();
                        results.add(new StringResult("Agent " + record.get("agent") + 
                            " has blockchain integration"));
                    }
                }
            }

            results.add(new StringResult("Security validation completed"));
        } catch (Exception e) {
            results.add(new StringResult("Error during security validation: " + e.getMessage()));
            e.printStackTrace();
        }
        return results.stream();
    }

    @Procedure(name = "safeai.debug.checkProductionReadiness", mode = Mode.READ)
    @Description("Performs comprehensive production readiness check")
    public Stream<StringResult> checkProductionReadiness() {
        List<StringResult> results = new ArrayList<>();
        try {
            // Check API keys and environment variables
            String openaiKey = System.getenv("OPENAI_API_KEY");
            String adminKey = System.getenv("ADMIN_WALLET_KEY");
            String blockchainEndpoint = System.getenv("BLOCKCHAIN_ENDPOINT");
            
            if (openaiKey == null || openaiKey.isEmpty()) {
                results.add(new StringResult("ERROR: OPENAI_API_KEY is not set"));
            } else {
                results.add(new StringResult("OPENAI_API_KEY is configured"));
            }
            
            if (adminKey == null || adminKey.isEmpty()) {
                results.add(new StringResult("ERROR: ADMIN_WALLET_KEY is not set"));
            } else {
                results.add(new StringResult("ADMIN_WALLET_KEY is configured"));
            }
            
            if (blockchainEndpoint == null || blockchainEndpoint.isEmpty()) {
                results.add(new StringResult("ERROR: BLOCKCHAIN_ENDPOINT is not set"));
            } else {
                results.add(new StringResult("BLOCKCHAIN_ENDPOINT is configured: " + blockchainEndpoint));
            }

            // Check database constraints
            try (Transaction tx = db.beginTx()) {
                Result constraints = tx.execute("SHOW CONSTRAINTS");
                boolean hasRequiredConstraints = false;
                while (constraints.hasNext()) {
                    Map<String, Object> constraint = constraints.next();
                    String name = (String) constraint.get("name");
                    if (name.equals("unique_kg_name") || 
                        name.equals("unique_agent_name") || 
                        name.equals("unique_capability_name")) {
                        hasRequiredConstraints = true;
                        results.add(new StringResult("Found required constraint: " + name));
                    }
                }
                if (!hasRequiredConstraints) {
                    results.add(new StringResult("ERROR: Required database constraints are missing"));
                }
            }

            // Check required procedures
            try (Transaction tx = db.beginTx()) {
                Result procedures = tx.execute("SHOW PROCEDURES YIELD name WHERE name CONTAINS 'safeai'");
                List<String> requiredProcedures = Arrays.asList(
                    "safeai.debug.loadKGFiles",
                    "safeai.debug.validateSecurity",
                    "safeai.governance.initiateVote",
                    "safeai.governance.recordVote"
                );
                Set<String> foundProcedures = new HashSet<>();
                while (procedures.hasNext()) {
                    Map<String, Object> proc = procedures.next();
                    foundProcedures.add((String) proc.get("name"));
                }
                
                for (String required : requiredProcedures) {
                    if (!foundProcedures.contains(required)) {
                        results.add(new StringResult("ERROR: Required procedure missing: " + required));
                    } else {
                        results.add(new StringResult("Found required procedure: " + required));
                    }
                }
            }

            // Check required KGs
            try (Transaction tx = db.beginTx()) {
                Result kgs = tx.execute(
                    "MATCH (kg:KnowledgeGraph) " +
                    "WHERE kg.name IN ['CyberSecurity', 'DataPrivacySecurity', 'LegalCompliance', 'RiskManagement'] " +
                    "RETURN kg.name as name"
                );
                Set<String> foundKGs = new HashSet<>();
                while (kgs.hasNext()) {
                    Map<String, Object> kg = kgs.next();
                    foundKGs.add((String) kg.get("name"));
                }
                
                List<String> requiredKGs = Arrays.asList(
                    "CyberSecurity",
                    "DataPrivacySecurity",
                    "LegalCompliance",
                    "RiskManagement"
                );
                
                for (String required : requiredKGs) {
                    if (!foundKGs.contains(required)) {
                        results.add(new StringResult("ERROR: Required KG missing: " + required));
                    } else {
                        results.add(new StringResult("Found required KG: " + required));
                    }
                }
            }

            // Check blockchain integration
            try {
                com.safeai.neo4jplugin.blockchain.BlockchainConnector.initialize(blockchainEndpoint);
                if (com.safeai.neo4jplugin.blockchain.BlockchainConnector.getWeb3j() != null) {
                    results.add(new StringResult("Blockchain connection verified"));
                } else {
                    results.add(new StringResult("ERROR: Blockchain connection failed"));
                }
            } catch (Exception e) {
                results.add(new StringResult("ERROR: Blockchain integration failed: " + e.getMessage()));
            }

            // Check LLM integration
            try {
                com.safeai.neo4jplugin.LLMClient llmClient = new com.safeai.neo4jplugin.LLMClient();
                com.safeai.neo4jplugin.LLMClient.QueryResult qr = llmClient.query_llm_schema("test query", "gpt-4");
                results.add(new StringResult("LLM integration verified"));
            } catch (Exception e) {
                results.add(new StringResult("ERROR: LLM integration failed: " + e.getMessage()));
            }

            // Check for any errors
            boolean hasErrors = results.stream()
                .anyMatch(r -> r.value.startsWith("ERROR:"));
            
            if (hasErrors) {
                results.add(new StringResult("PRODUCTION READINESS CHECK FAILED - Please address the errors above"));
            } else {
                results.add(new StringResult("PRODUCTION READINESS CHECK PASSED - System is ready for production use"));
            }

        } catch (Exception e) {
            results.add(new StringResult("ERROR during production readiness check: " + e.getMessage()));
            e.printStackTrace();
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
