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

        // Dynamically load and apply Rotate90Agent if it is available
        for (JSONObject agent : agents) {
            String agentName = agent.getString("name");
            if ("Rotate90Agent".equals(agentName)) {
                try {
                    // Dynamically load the agent class
                    Class<?> clazz = Class.forName(agent.getString("class"));
                    Object instance = clazz.getConstructor(GraphRAG.class).newInstance(graphRAG);
                    System.out.println("Dynamically loaded agent: " + agentName);

                    // Create a dummy puzzle grid
                    List<List<Integer>> puzzleGrid = Arrays.asList(
                        Arrays.asList(1, 2, 3),
                        Arrays.asList(4, 5, 6),
                        Arrays.asList(7, 8, 9)
                    );

                    // Assume that the agent implements a method generate_candidate
                    // Here we cast it to Rotate90Agent as that's the expected type
                    Rotate90Agent rotateAgent = (Rotate90Agent) instance;
                    List<List<List<Integer>>> candidates = rotateAgent.generate_candidate(puzzleGrid);
                    System.out.println("Transformed grid:\n" + candidates.get(0));
                } catch (Exception e) {
                    System.out.println("Error loading agent " + agentName + ": " + e.getMessage());
                }
            }
        }

        // Close connection
        graphRAG.close();
    }
}
