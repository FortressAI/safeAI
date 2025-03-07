package com.safeai.neo4jplugin;

import com.safeai.neo4jplugin.graph_rag.GraphRAG;
import com.safeai.neo4jplugin.learning.ConversationalAgent;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertNotNull;

/**
 * Unit tests for ConversationalAgent in the Learning Module.
 */
public class ConversationalAgentTest {
    @Test
    public void testStartConversation() {
        GraphRAG graphRag = new GraphRAG("bolt://localhost:7687", "neo4j", "testpassword");
        ConversationalAgent agent = new ConversationalAgent(graphRag);
        String response = agent.startConversation("Hello").join();
        assertNotNull(response);
        graphRag.close();
    }
}
