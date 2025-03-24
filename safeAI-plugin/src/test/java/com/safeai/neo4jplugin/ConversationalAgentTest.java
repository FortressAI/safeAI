package com.safeai.neo4jplugin;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests for ConversationalAgent in the Learning Module.
 */
public class ConversationalAgentTest {
    private ConversationalAgent agent;
    
    @BeforeEach
    void setUp() {
        // Set default value for LLM_MAX_TOKENS if not set
        if (System.getenv("LLM_MAX_TOKENS") == null) {
            System.setProperty("LLM_MAX_TOKENS", "2000");
        }
        agent = new ConversationalAgent();
    }
    
    @Test
    void testStartConversation() {
        String response = agent.startConversation("Hello, how are you?");
        assertNotNull(response);
        assertFalse(response.isEmpty());
    }
    
    @Test
    void testConversationContext() {
        agent.startConversation("My name is Alice");
        String response = agent.continueConversation("What's my name?");
        assertTrue(response.toLowerCase().contains("alice"));
    }
}
