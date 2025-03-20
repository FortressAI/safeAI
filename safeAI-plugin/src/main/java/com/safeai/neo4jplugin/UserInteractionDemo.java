package com.safeai.neo4jplugin;

import com.safeai.neo4jplugin.graph_rag.GraphRAG;
import org.json.JSONObject;

import java.util.Arrays;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Demo application showcasing user interaction with agents from the SafeAI plugin.
 * This demonstrates how to connect to Neo4j, fetch agents, and execute them dynamically.
 */
public class UserInteractionDemo {
    private static final Logger logger = Logger.getLogger(UserInteractionDemo.class.getName());
    
    public static void main(String[] args) {
        logger.info("Starting SafeAI User Interaction Demo");
        
        // Initialize the plugin configuration
        if (!MainPlugin.initialize()) {
            logger.severe("Failed to initialize SafeAI plugin. Exiting demo.");
            System.exit(1);
        }
        
        // Get Neo4j connection parameters from configuration
        String neo4jUri = MainPlugin.getConfigProperty("neo4j.uri", "bolt://localhost:7687");
        String neo4jUser = MainPlugin.getConfigProperty("neo4j.username", "neo4j");
        String neo4jPassword = MainPlugin.getConfigProperty("neo4j.password", "password");
        
        GraphRAG graphRAG = null;
        
        try {
            // Establish connection to the secure KG (Neo4j)
            logger.info("Connecting to Neo4j at " + neo4jUri);
            graphRAG = new GraphRAG(neo4jUri, neo4jUser, neo4jPassword);
            
            // Initialize AgentRegistry to fetch dynamic agent definitions from the KG
            logger.info("Initializing agent registry");
            AgentRegistry registry = new AgentRegistry(graphRAG);
            List<JSONObject> agents = registry.fetchAgents();
            
            if (agents.isEmpty()) {
                logger.warning("No agents found in registry. Demo may not work as expected.");
            }
            
            // Display available agent definitions
            logger.info("Available agents from secure KG:");
            for (JSONObject agent : agents) {
                logger.info(agent.toString());
            }
            
            // Create a sample puzzle grid for testing
            List<List<Integer>> puzzleGrid = Arrays.asList(
                Arrays.asList(1, 2, 3),
                Arrays.asList(4, 5, 6),
                Arrays.asList(7, 8, 9)
            );
            
            // Iterate through each agent and test its functionality
            logger.info("Testing agent functionality with sample puzzle grid");
            for (JSONObject agentDef : agents) {
                try {
                    String agentName = agentDef.getString("name");
                    logger.info("Creating agent: " + agentName);
                    
                    Object agentInstance = DynamicAgentCreator.createAgent(agentDef, graphRAG);
                    logger.info("Successfully loaded agent: " + agentName);
                    
                    java.lang.reflect.Method method = agentInstance.getClass().getMethod("generate_candidate", List.class);
                    Object candidate = method.invoke(agentInstance, puzzleGrid);
                    
                    logger.info("Agent " + agentName + " generated candidate: " + candidate);
                } catch (Exception e) {
                    logger.log(Level.SEVERE, "Error processing agent " + agentDef.getString("name"), e);
                }
            }
            
            logger.info("Demo completed successfully");
            
        } catch (Exception e) {
            logger.log(Level.SEVERE, "Error in SafeAI demo", e);
        } finally {
            // Close connection in finally block to ensure it happens
            if (graphRAG != null) {
                try {
                    logger.info("Closing connection to Neo4j");
                    graphRAG.close();
                } catch (Exception e) {
                    logger.log(Level.WARNING, "Error closing GraphRAG connection", e);
                }
            }
        }
    }
}
