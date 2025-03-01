package com.safeai.neo4jplugin;

import org.neo4j.procedure.*;
import org.neo4j.graphdb.GraphDatabaseService;
import org.neo4j.graphdb.Result;
import org.neo4j.graphdb.Transaction;

import java.util.HashMap;
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

        // Execute the generated query using a transaction
        try (Transaction tx = db.beginTx()) {
            Result result = tx.execute(cypherQuery);
            
            // Convert Result to Stream of MapResult objects
            // Create a list to hold our results (since the Result will be closed when the transaction ends)
            java.util.List<MapResult> resultList = new java.util.ArrayList<>();
            
            while (result.hasNext()) {
                Map<String, Object> row = result.next();
                resultList.add(new MapResult(row));
            }
            
            // Commit the transaction
            tx.commit();
            
            // Return the stream from our collected results
            return resultList.stream();
        }
    }

    public static class MapResult {
        public Map<String, Object> result;

        public MapResult(Map<String, Object> result) {
            this.result = result;
        }
    }
}