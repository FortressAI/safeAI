package com.safeai.neo4jplugin.utilities;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

public class LLMService {
    /**
     * Simulates an LLM call that generates example queries for a new domain.
     *
     * @param llmPrompt The natural language prompt provided by the user.
     * @param phase The phase for which to generate examples: "training", "evaluation", or "finalExam".
     * @param domainName The name of the domain.
     * @return Generated examples as a String.
     */
    public static String generateExamples(String llmPrompt, String phase, String domainName) {
        switch (phase.toLowerCase()) {
            case "training":
                return "Generated training examples for " + domainName + " based on prompt: " + llmPrompt;
            case "evaluation":
                return "Generated evaluation examples for " + domainName + " based on prompt: " + llmPrompt;
            case "finalexam":
                return "Generated final exam example (in JSON format) for " + domainName + " based on prompt: " + llmPrompt;
            default:
                return "No examples generated.";
        }
    }
    
    public static String generateCandidate(String prompt) {
        String endpoint = System.getenv("LLM_ENDPOINT");
        String apiKey = System.getenv("LLM_API_KEY");
        if (endpoint == null || endpoint.trim().isEmpty()) {
            return "Simulated LLM response: " + prompt;
        }
        try {
            URL url = new URL(endpoint);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setDoOutput(true);
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Content-Type", "application/json");
            if (apiKey != null && !apiKey.isEmpty()) {
                conn.setRequestProperty("Authorization", "Bearer " + apiKey);
            }
            String safePrompt = prompt.replace("\"", "\\\"");
            String inputJson = "{\"prompt\": \"" + safePrompt + "\"}";
            try (OutputStream os = conn.getOutputStream()) {
                os.write(inputJson.getBytes("UTF-8"));
                os.flush();
            }
            int responseCode = conn.getResponseCode();
            if (responseCode != HttpURLConnection.HTTP_OK) {
                return "Simulated LLM response (HTTP error " + responseCode + "): " + prompt;
            }
            BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream(), "UTF-8"));
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = br.readLine()) != null) {
                sb.append(line);
            }
            conn.disconnect();
            String result = sb.toString();
            if(result == null || result.trim().isEmpty()){
                result = "Simulated LLM response (empty): " + prompt;
            }
            return result;
        } catch (Exception e) {
            String errorMsg = e.getMessage() == null ? e.toString() : e.getMessage();
                return "Simulated LLM response (Exception: " + errorMsg + "): " + prompt;
        }
    }
}
