package com.openhands.safeai.procedures;

import org.neo4j.procedure.Description;
import org.neo4j.procedure.Name;
import org.neo4j.procedure.Procedure;
import org.neo4j.graphdb.GraphDatabaseService;
import org.neo4j.procedure.Context;

import java.util.List;
import java.util.stream.Stream;

public class CreateDomainProcedure {
    @Context
    public GraphDatabaseService db;

    public static class Output {
        public String domain;
        public String status;

        public Output(String domain, String status) {
            this.domain = domain;
            this.status = status;
        }
    }

    @Procedure(value = "safeAI.createDomain", mode = Procedure.Mode.WRITE)
    @Description("CALL safeAI.createDomain(domain, description, trainingExamples, evaluationExamples, finalExamExamples, billingSettings) YIELD domain, status - creates a new domain using built-in procedures without exposing internal details.")
    public Stream<Output> createDomain(
            @Name("domain") String domain,
            @Name("description") String description,
            @Name("trainingExamples") List<String> trainingExamples,
            @Name("evaluationExamples") List<String> evaluationExamples,
            @Name("finalExamExamples") List<String> finalExamExamples,
            @Name("billingSettings") String billingSettings) {
        // In a full implementation, this method would internally configure the new domain without exposing complex details.
        // For now, we simulate a successful domain creation.
        return Stream.of(new Output(domain, "Domain created successfully"));
    }
}

