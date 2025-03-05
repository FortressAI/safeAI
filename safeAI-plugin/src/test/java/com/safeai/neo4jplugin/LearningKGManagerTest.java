package com.safeai.neo4jplugin;

import com.safeai.neo4jplugin.graph_rag.GraphRAG;
import com.safeai.neo4jplugin.learning.LearningKGManager;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;
import java.util.List;
import java.util.Map;

public class LearningKGManagerTest {
    @Test
    public void testInstallARCkg() {
        // Install ARC KG using the LearningKGManager
        LearningKGManager manager = new LearningKGManager("bolt://localhost:7687", "neo4j", "testpassword");
        boolean success = manager.installARCkg("https://arcprize.org/guide/arckg.json");
        assertTrue(success, "Installation should succeed");
        manager.close();
        
        // Verify that the default KnowledgeGraph node was created
        GraphRAG graphRag = new GraphRAG("bolt://localhost:7687", "neo4j", "testpassword");
        // Assuming GraphRAG has a method runQuery that returns a list of result maps
        List<Map<String, Object>> result = graphRag.runQuery("MATCH (n:KnowledgeGraph {name: 'ARC KG'}) RETURN n");
        assertFalse(result.isEmpty(), "Default KnowledgeGraph node should exist after installation.");
        graphRag.close();
    }
}
