package com.safeai.neo4jplugin;

import com.safeai.neo4jplugin.graph_rag.GraphRAG;
import org.json.JSONArray;
import org.json.JSONObject;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

public class AgentRegistry {
    private GraphRAG graphRAG;
    private String kgFilePath;

    // New constructor with KG file path
    public AgentRegistry(GraphRAG graphRAG, String kgFilePath) {
        this.graphRAG = graphRAG;
        this.kgFilePath = kgFilePath;
    }

    // Fallback constructor if no KG file path is provided
    public AgentRegistry(GraphRAG graphRAG) {
        this(graphRAG, null);
    }

    public List<JSONObject> fetchAgents() {
        if (kgFilePath != null) {
            try {
                String content = new String(Files.readAllBytes(Paths.get(kgFilePath)), StandardCharsets.UTF_8);
                JSONObject kg = new JSONObject(content);
                JSONArray agentsArray = kg.getJSONArray("agents");
                List<JSONObject> agents = new ArrayList<>();
                for (int i = 0; i < agentsArray.length(); i++) {
                    agents.add(agentsArray.getJSONObject(i));
                }
                return agents;
            } catch (Exception e) {
                throw new RuntimeException("Error loading KG JSON from " + kgFilePath, e);
            }
        } else {
            List<JSONObject> agents = new ArrayList<>();
            JSONObject agent = new JSONObject();
            agent.put("name", "Rotate90Agent");
            agent.put("description", "Rotates the puzzle grid 90 degrees clockwise.");
            agent.put("class", "com.safeai.neo4jplugin.specialized_agents.Rotate90Agent");
            agents.add(agent);

            JSONObject groovyAgent = new JSONObject();
            groovyAgent.put("name", "GroovyAgent");
            groovyAgent.put("description", "Agent implemented with dynamic Groovy script.");
            groovyAgent.put("groovyScript", "import com.safeai.neo4jplugin.graph_rag.GraphRAG\\n" +
                    "class GroovyAgent {\\n" +
                    "  def generate_candidate(puzzleGrid) {\\n" +
                    "    def rotated = []\\n" +
                    "    for (int c = 0; c < puzzleGrid[0].size(); c++) {\\n" +
                    "      def newRow = []\\n" +
                    "      for (int r = puzzleGrid.size()-1; r >= 0; r--) {\\n" +
                    "        newRow.add(puzzleGrid[r][c])\\n" +
                    "      }\\n" +
                    "      rotated.add(newRow)\\n" +
                    "    }\\n" +
                    "    return [rotated]\\n" +
                    "  }\\n" +
                    "}\\n" +
                    "return new GroovyAgent()");
            agents.add(groovyAgent);

            JSONObject llmAgent = new JSONObject();
            llmAgent.put("name", "LLMAgent");
            llmAgent.put("description", "Agent that uses LLM logic to output a simulated response.");
            llmAgent.put("llmLogic", "Simulated LLM response for LLMAgent.");
            agents.add(llmAgent);

            return agents;
        }
    }
}
