package com.safeai.neo4jplugin;

public class LLMClient {
    public QueryResult query_llm_schema(String input, String model) {
        String key = System.getenv("OPENAI_API_KEY");
        if(key == null || key.isEmpty()){
            key = System.getProperty("OPENAI_API_KEY");
        }
        if(key == null || key.isEmpty()){
            throw new RuntimeException("OPENAI_API_KEY is not set");
        }
        return new QueryResult("Simulated LLM query using API key: " + key);
    }
    
    public static class QueryResult {
        public String solution_text;
        
        public QueryResult(String solution_text) {
            this.solution_text = solution_text;
        }
    }
}
