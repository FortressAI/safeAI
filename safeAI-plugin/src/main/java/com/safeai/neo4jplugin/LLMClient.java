package com.safeai.neo4jplugin;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import org.json.JSONObject;
import org.json.JSONArray;

public class LLMClient {
    public QueryResult query_llm_schema(String input, String model) {
        String key = System.getenv("OPENAI_API_KEY");
        if(key == null || key.isEmpty()){
            key = System.getProperty("OPENAI_API_KEY");
        }
        if(key == null || key.isEmpty()){
            throw new RuntimeException("OPENAI_API_KEY is not set");
        }
        try {
            HttpClient client = HttpClient.newHttpClient();
            String endpoint = "https://api.openai.com/v1/completions";
            JSONObject payload = new JSONObject();
            payload.put("model", model);
            payload.put("prompt", input);
            payload.put("max_tokens", 50);
            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(endpoint))
                .header("Content-Type", "application/json")
                .header("Authorization", "Bearer " + key)
                .POST(HttpRequest.BodyPublishers.ofString(payload.toString()))
                .build();
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            if(response.statusCode() != 200){
                throw new RuntimeException("OpenAI API error. Status: " + response.statusCode() + ", Body: " + response.body());
            }
            JSONObject jsonResponse = new JSONObject(response.body());
            JSONArray choices = jsonResponse.getJSONArray("choices");
            if(choices.length() == 0){
                throw new RuntimeException("No choices returned from OpenAI API.");
            }
            JSONObject firstChoice = choices.getJSONObject(0);
            String completedText = firstChoice.getString("text");
            return new QueryResult(completedText);
        } catch (Exception e) {
            throw new RuntimeException("Error querying OpenAI API: " + e.getMessage(), e);
        }
    }
    
    public static class QueryResult {
        public String solution_text;
        
        public QueryResult(String solution_text) {
            this.solution_text = solution_text;
        }
    }
}
