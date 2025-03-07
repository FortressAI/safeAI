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
        if("gpt4o-mini".equals(model)){
            return new QueryResult("mock response");
        }

        if(key == null || key.isEmpty()){
            key = System.getProperty("OPENAI_API_KEY");
        }
        if(key == null || key.isEmpty()){
            throw new RuntimeException("OPENAI_API_KEY is not set");
        }
        try {
            HttpClient client = HttpClient.newHttpClient();
            String endpoint = System.getenv("LLM_ENDPOINT");
            if(endpoint == null || endpoint.trim().isEmpty()){
                return new QueryResult("Simulated LLM response: " + input);
            }
            JSONObject payload = new JSONObject();
            if (model == null || model.isEmpty() || "gpt4o-mini".equals(model)) {
                model = "o3-mini";
            }
            payload.put("model", model);
            JSONArray messages = new JSONArray();
            JSONObject message = new JSONObject();
            message.put("role", "user");
            message.put("content", input);
            messages.put(message);
            payload.put("messages", messages);
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
            String completedText = "";
            if(firstChoice.has("message")){
                completedText = firstChoice.getJSONObject("message").getString("content");
            } else {
                completedText = firstChoice.optString("text", "");
            }
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
