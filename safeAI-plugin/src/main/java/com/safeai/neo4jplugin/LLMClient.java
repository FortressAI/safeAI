package com.safeai.neo4jplugin;

public class LLMClient {
    public QueryResult query_llm_schema(String input, String model) {
        // Minimal dummy implementation returning a default cypher query
        return new QueryResult("MATCH (n) RETURN n LIMIT 25");
    }
    
    public static class QueryResult {
        public String solution_text;
        
        public QueryResult(String solution_text) {
            this.solution_text = solution_text;
        }
    }
}
