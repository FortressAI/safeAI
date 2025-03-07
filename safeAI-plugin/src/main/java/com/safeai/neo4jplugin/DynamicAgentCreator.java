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
        } else if (agentDef.has("groovyScript")) {
            String script = agentDef.getString("groovyScript");
            Binding binding = new Binding();
            binding.setVariable("graphRAG", graphRAG);
            GroovyShell shell = new GroovyShell(binding);
            Object result = shell.evaluate(script);
            return result;
        } else if (agentDef.has("llmLogic")) {
            return new Object() {
                public Object generate_candidate(java.util.List<java.util.List<Integer>> puzzleGrid) {
                    return agentDef.getString("llmLogic");
                }
            };
        } else {
            throw new IllegalArgumentException("Agent definition does not have a valid type.");
        }
    }
}
