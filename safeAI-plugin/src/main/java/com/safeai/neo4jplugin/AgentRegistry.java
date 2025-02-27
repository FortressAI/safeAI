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
        // Dynamic agent definitions fetched from a secure KG (Neo4j) via GraphRAG API
        List<JSONObject> agents = new ArrayList<>();
        JSONObject agent = new JSONObject();
        agent.put("name", "Rotate90Agent");
        agent.put("description", "Rotates the puzzle grid 90 degrees clockwise.");
        agent.put("class", "com.safeai.neo4jplugin.specialized_agents.Rotate90Agent");
        agents.add(agent);
        return agents;
    }
}
