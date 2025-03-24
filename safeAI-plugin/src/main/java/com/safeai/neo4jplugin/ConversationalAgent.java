package com.safeai.neo4jplugin;

import java.util.ArrayList;
import java.util.List;

public class ConversationalAgent {
    private List<String> conversationHistory;
    private int maxTokens;
    
    public ConversationalAgent() {
        this.conversationHistory = new ArrayList<>();
        this.maxTokens = Integer.parseInt(System.getProperty("LLM_MAX_TOKENS", "2000"));
    }
    
    public String startConversation(String message) {
        conversationHistory.clear();
        return continueConversation(message);
    }
    
    public String continueConversation(String message) {
        conversationHistory.add(message);
        
        // Simple context-aware response generation
        if (message.toLowerCase().contains("what's my name")) {
            // Look for name in previous messages
            for (String prevMessage : conversationHistory) {
                if (prevMessage.toLowerCase().contains("my name is")) {
                    String name = prevMessage.substring(prevMessage.toLowerCase().indexOf("my name is") + 10).trim();
                    return "Your name is " + name;
                }
            }
        }
        
        // Default response
        return "I understand your message: " + message;
    }
    
    public List<String> getConversationHistory() {
        return new ArrayList<>(conversationHistory);
    }
    
    public int getMaxTokens() {
        return maxTokens;
    }
} 