package com.safeai.neo4jplugin;

import org.json.JSONObject;
import com.safeai.neo4jplugin.graph_rag.GraphRAG;
import groovy.lang.GroovyShell;
import groovy.lang.Binding;

public class DynamicAgentCreator {
    public static Object createAgent(JSONObject agentDef, GraphRAG graphRAG) throws Exception {
        if (agentDef.has("class")) {
            String className = agentDef.getString("class");
            Class<?> clazz = Class.forName(className);
            return clazz.getConstructor(GraphRAG.class).newInstance(graphRAG);
        } else if (agentDef.has("agent_code")) {
            String script = agentDef.getString("agent_code");
            Binding binding = new Binding();
            binding.setVariable("graphRAG", graphRAG);
            GroovyShell shell = new GroovyShell(binding);
            return shell.evaluate(script);
        } else if (agentDef.has("groovyScript")) {
            String script = agentDef.getString("groovyScript");
            Binding binding = new Binding();
            binding.setVariable("graphRAG", graphRAG);
            GroovyShell shell = new GroovyShell(binding);
            return shell.evaluate(script);
        } else if (agentDef.has("llmLogic")) {
            String prompt = agentDef.getString("llmLogic");
            return new Object() {
                public Object generate_candidate(java.util.List<java.util.List<Integer>> puzzleGrid) {
                    try {
                        String fullPrompt = prompt + " Puzzle grid data: " + puzzleGrid.toString();
                        String candidate = com.safeai.neo4jplugin.utilities.LLMService.generateCandidate(fullPrompt);
                        return candidate;
                    } catch (Exception e) {
                        throw new RuntimeException("Error generating candidate with LLM", e);
                    }
                }
            };
        } else {
            throw new IllegalArgumentException("Agent definition does not have a valid type.");
        }
    }
}

