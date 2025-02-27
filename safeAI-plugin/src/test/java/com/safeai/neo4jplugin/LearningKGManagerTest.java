package com.safeai.neo4jplugin;

import com.safeai.neo4jplugin.graph_rag.GraphRAG;
import com.safeai.neo4jplugin.learning.LearningKGManager;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * Unit tests for LearningKGManager.
 */
public class LearningKGManagerTest {
    @Test
    public void testInstallARCkg() {
        GraphRAG graphRag = new GraphRAG("bolt://localhost:7687", "neo4j", "testpassword");
        LearningKGManager manager = new LearningKGManager("bolt://localhost:7687", "neo4j", "testpassword");
        // Use a valid URL for testing if available; here we use a demo URL.
        boolean success = manager.installARCkg("https://arcprize.org/guide/arckg.json");
        assertTrue(success);
        manager.close();
    }
}
