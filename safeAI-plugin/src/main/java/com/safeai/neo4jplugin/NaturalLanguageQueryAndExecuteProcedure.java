package com.safeai.neo4jplugin;

import org.neo4j.procedure.*;
import org.neo4j.graphdb.GraphDatabaseService;
import org.neo4j.graphdb.Result;

import java.util.Map;
import java.util.stream.Stream;

public class NaturalLanguageQueryAndExecuteProcedure {

    @Context
    public GraphDatabaseService db;

    @Procedure(name = "nl.queryAndExecute", mode = Mode.READ)
    @Description("nl.queryAndExecute(query) - Generates a Cypher query from a natural language prompt using the integrated LLM, executes it, and returns the results.")
    public Stream<MapResult> queryAndExecute(@Name("query") String query) {
        // Use the LLMClient to generate a Cypher query from the natural language prompt.
        LLMClient llmClient = new LLMClient();
        LLMClient.QueryResult generated = llmClient.query_llm_schema(query, "gpt-4o-mini");

        String cypherQuery = generated.solution_text;

        // Execute the generated query using the injected GraphDatabaseService.
        Result result = db.execute(cypherQuery);

        // Map the result records to MapResult objects for returning.
        return result.stream().map(record -> new MapResult(record.asMap()));
    }

    public static class MapResult {
        public Map<String, Object> result;

        public MapResult(Map<String, Object> result) {
            this.result = result;
        }
    }
}
