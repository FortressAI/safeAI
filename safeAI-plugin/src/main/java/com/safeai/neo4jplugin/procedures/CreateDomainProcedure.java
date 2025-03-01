package com.safeai.neo4jplugin.procedures;

import com.safeai.neo4jplugin.utilities.DomainConfigurationManager;
import com.safeai.neo4jplugin.utilities.LLMService;
import org.neo4j.procedure.Description;
import org.neo4j.procedure.Name;
import org.neo4j.procedure.Procedure;
import org.neo4j.graphdb.GraphDatabaseService;
import org.neo4j.procedure.Context;

import java.util.Map;
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
    @Description("CALL safeAI.createDomain(domainData) YIELD domain, status - Creates a new domain using an internal LLM to generate dynamic training, evaluation and final exam examples. " +
                 "domainData must be a map with keys: domainName (String), description (String), llmPrompt (String), and billing (Map with pricePerQuery, minimumFee, monthlyQuota).")
    public Stream<Output> createDomain(@Name("domainData") Map<String, Object> domainData) {
        String domainName = (String) domainData.get("domainName");
        String description = (String) domainData.get("description");
        String llmPrompt = (String) domainData.get("llmPrompt");
        @SuppressWarnings("unchecked")
        Map<String, Object> billing = (Map<String, Object>) domainData.get("billing");

        String trainingExamples = LLMService.generateExamples(llmPrompt, "training", domainName);
        String evaluationExamples = LLMService.generateExamples(llmPrompt, "evaluation", domainName);
        String finalExamExample = LLMService.generateExamples(llmPrompt, "finalExam", domainName);

        boolean success = DomainConfigurationManager.createDomain(domainName, description, trainingExamples, evaluationExamples, finalExamExample, billing);

        if (success) {
            return Stream.of(new Output(domainName, "Domain created successfully with LLM-generated examples"));
        } else {
            return Stream.of(new Output(domainName, "Domain creation failed"));
        }
    }
}
