package com.safeai.neo4jplugin;

import com.safeai.neo4jplugin.graph_rag.GraphRAG;
import org.json.JSONObject;
import java.util.ArrayList;
import java.util.List;

public class AgentRegistry {
    private GraphRAG graphRAG;

    public AgentRegistry(GraphRAG graphRAG) {
        this.graphRAG = graphRAG;
    }

    public List<JSONObject> fetchAgents() {
        List<JSONObject> agents = new ArrayList<>();
        JSONObject agent = new JSONObject();
        agent.put("name", "Rotate90Agent");
        agent.put("description", "Rotates the puzzle grid 90 degrees clockwise.");
        agent.put("class", "com.safeai.neo4jplugin.specialized_agents.Rotate90Agent");
        agents.add(agent);

        JSONObject groovyAgent = new JSONObject();
        groovyAgent.put("name", "GroovyAgent");
        groovyAgent.put("description", "Agent implemented with dynamic Groovy script.");
        groovyAgent.put("groovyScript", "import com.safeai.neo4jplugin.graph_rag.GraphRAG\n" +
                "class GroovyAgent {\n" +
                "  def generate_candidate(puzzleGrid) {\n" +
                "    def rotated = []\n" +
                "    for (int c = 0; c < puzzleGrid[0].size(); c++) {\n" +
                "      def newRow = []\n" +
                "      for (int r = puzzleGrid.size()-1; r >= 0; r--) {\n" +
                "        newRow.add(puzzleGrid[r][c])\n" +
                "      }\n" +
                "      rotated.add(newRow)\n" +
                "    }\n" +
                "    return [rotated]\n" +
                "  }\n" +
                "}\n" +
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
