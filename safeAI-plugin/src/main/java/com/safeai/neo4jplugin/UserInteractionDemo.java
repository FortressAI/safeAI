package com.safeai.neo4jplugin;

import com.safeai.neo4jplugin.graph_rag.GraphRAG;
import com.safeai.neo4jplugin.specialized_agents.Rotate90Agent;
import org.json.JSONObject;

import java.util.Arrays;
import java.util.List;

public class UserInteractionDemo {
    public static void main(String[] args) {
        // Establish connection to the secure KG (Neo4j) with dummy parameters
        GraphRAG graphRAG = new GraphRAG("bolt://localhost:7687", "neo4j", "testpassword");

        // Initialize AgentRegistry to fetch dynamic agent definitions from the KG
        AgentRegistry registry = new AgentRegistry(graphRAG);
        List<JSONObject> agents = registry.fetchAgents();

        // Display available agent definitions
        System.out.println("Available agents from secure KG:");
        for (JSONObject agent : agents) {
            System.out.println(agent.toString());
        }

        List<List<Integer>> puzzleGrid = Arrays.asList(
            Arrays.asList(1, 2, 3),
            Arrays.asList(4, 5, 6),
            Arrays.asList(7, 8, 9)
        );
        for (JSONObject agentDef : agents) {
            try {
                Object agentInstance = DynamicAgentCreator.createAgent(agentDef, graphRAG);
                System.out.println("Loaded agent: " + agentDef.getString("name"));
                java.lang.reflect.Method method = agentInstance.getClass().getMethod("generate_candidate", List.class);
                Object candidate = method.invoke(agentInstance, puzzleGrid);
                System.out.println("Agent " + agentDef.getString("name") + " generated candidate: " + candidate);
            } catch (Exception e) {
                System.out.println("Error loading agent " + agentDef.getString("name") + ": " + e.getMessage());
            }
        }

        // Close connection
        graphRAG.close();
    }
}
