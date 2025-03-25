package com.safeai.neo4jplugin;

import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;

import com.safeai.neo4jplugin.learning.LearningKGManager;

/**
 * Unit tests for LearningKGManager.
 */
public class LearningKGManagerTest {
    
    @Test
    public void testInstallARCkg() {
        // Create a LearningKGManager with dummy connection details
        // The actual Neo4j operations might fail, but the method should still return true
        // because it loads KGs from resources
        LearningKGManager manager = new LearningKGManager(
                "bolt://localhost:7687", 
                "neo4j", 
                "password");
        
        try {
            // Call the method
            boolean result = manager.installARCkg("https://example.com/arc-kg.json");
            
            // Verify the result
            assertTrue(result, "ARC KG installation should succeed with resources even if Neo4j connection fails");
        } finally {
            // Clean up
            manager.close();
        }
    }
    
    @Test
    public void testInstallARCkgWithInvalidUrl() {
        // Create a LearningKGManager with dummy connection details
        LearningKGManager manager = new LearningKGManager(
                "bolt://localhost:7687", 
                "neo4j", 
                "password");
        
        try {
            // Test with an invalid URL
            boolean result = manager.installARCkg("invalid-url");
            
            // The method should still return true because it loads from resources even if URL is invalid
            assertTrue(result, "ARC KG installation should succeed with resources even with invalid URL");
        } finally {
            // Clean up
            manager.close();
        }
    }
}
