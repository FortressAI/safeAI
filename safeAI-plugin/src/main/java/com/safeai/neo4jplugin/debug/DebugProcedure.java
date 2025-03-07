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

public class DebugProcedure { @Context public GraphDatabaseService db;

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
        // KG file names including ARC_Puzzle_Agent_Definitions_KG.json
        String[] kgFiles = {
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

@Procedure(name = "safeai.debug.loadKGFiles", mode = Mode.WRITE)
@Description("Loads all KG JSON files from resources, creates a KnowledgeGraph node, and creates Agent nodes if defined")
public Stream<StringResult> loadKGFiles() {
    List<StringResult> results = new ArrayList<>();
    try {
        // Delete existing KnowledgeGraph and Agent nodes to avoid duplicates.
        try (Transaction tx = db.beginTx()) {
            tx.execute("MATCH (n) WHERE n:KnowledgeGraph OR n:Agent DETACH DELETE n");
            tx.commit();
            results.add(new StringResult("Deleted existing KnowledgeGraph and Agent nodes"));
        }

        ClassLoader classLoader = getClass().getClassLoader();
        // KG file names including ARC_Puzzle_Agent_Definitions_KG.json
        String[] kgFiles = {
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

        int loadedCount = 0;
        // Process each KG file.
        for (String kgFile : kgFiles) {
            InputStream is = classLoader.getResourceAsStream(kgFile);
            if (is != null) {
                try {
                    BufferedReader reader = new BufferedReader(new InputStreamReader(is));
                    StringBuilder contentBuilder = new StringBuilder();
                    String line;
                    while ((line = reader.readLine()) != null) {
                        contentBuilder.append(line);
                    }
                    String jsonStr = contentBuilder.toString();
                    JSONObject jsonObj = new JSONObject(jsonStr);
                    
                    // Use a provided domain name or derive it from the file name.
                    String domainName = jsonObj.has("domain") ? jsonObj.getString("domain") 
                        : kgFile.replace("_KG.json", "");
                    
                    // Begin a transaction to write the KnowledgeGraph and Agent nodes.
                    try (Transaction tx = db.beginTx()) {
                        // Create the top-level KnowledgeGraph node.
                        tx.execute(
                            "CREATE (kg:KnowledgeGraph {name: $name, description: $description, content: $content})",
                            Map.of(
                                "name", domainName,
                                "description", jsonObj.optString("description", "Agentic Knowledge Graph for " + domainName),
                                "content", jsonStr.substring(0, Math.min(1000, jsonStr.length()))
                            )
                        );
                        
                        // If the JSON defines agents, create an Agent node for each.
                        if (jsonObj.has("agents")) {
                            JSONArray agents = jsonObj.getJSONArray("agents");
                            for (int i = 0; i < agents.length(); i++) {
                                JSONObject agentObj = agents.getJSONObject(i);
                                // Build a map of properties for the Agent.
                                Map<String, Object> agentProps = new HashMap<>();
                                for (String key : agentObj.keySet()) {
                                    agentProps.put(key, agentObj.get(key));
                                }
                                // Optionally add a property linking the agent to its KnowledgeGraph.
                                agentProps.put("kgName", domainName);
                                // Create the Agent node and a HAS_AGENT relationship from the KnowledgeGraph node.
                                tx.execute(
                                    "MATCH (kg:KnowledgeGraph {name: $kgName}) " +
                                    "CREATE (a:Agent) SET a = $props " +
                                    "CREATE (kg)-[:HAS_AGENT]->(a)",
                                    Map.of("kgName", domainName, "props", agentProps)
                                );
                            }
                        }
                        
                        tx.commit();
                        loadedCount++;
                        int agentsCount = jsonObj.has("agents") ? jsonObj.getJSONArray("agents").length() : 0;
                        results.add(new StringResult("Loaded KG: " + domainName + " with " + agentsCount + " agent(s)"));
                    }
                } catch (Exception e) {
                    results.add(new StringResult("Error processing " + kgFile + ": " + e.getMessage()));
                } finally {
                    is.close();
                }
            }
        }
        results.add(new StringResult("Total KGs loaded: " + loadedCount));
    } catch (Exception e) {
        results.add(new StringResult("Error: " + e.getMessage()));
    }
    return results.stream();
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


}
