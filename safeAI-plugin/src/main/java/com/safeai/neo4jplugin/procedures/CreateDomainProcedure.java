package com.safeai.neo4jplugin.procedures;

import java.util.Map;
import java.util.stream.Stream;

import org.neo4j.graphdb.GraphDatabaseService;
import org.neo4j.procedure.Context;
import org.neo4j.procedure.Description;
import org.neo4j.procedure.Mode;
import org.neo4j.procedure.Name;
import org.neo4j.procedure.Procedure;

import com.safeai.neo4jplugin.utilities.DomainConfigurationManager;
import com.safeai.neo4jplugin.utilities.LLMService;

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

    @Procedure(value = "safeAI.createDomain", mode = Mode.WRITE)
    @Description("CALL safeAI.createDomain(domainData) YIELD domain, status - Creates a new Agentic KG domain. " +
                 "domainData must be a map with the following keys: " +
                 "domainName (String), description (String), llmPrompt (String) – a detailed prompt " +
                 "describing domain context and desired agent behavior, agentDefinitions (Map or JSON String) " +
                 "with initial transformation agent configurations, and billing (Map with pricePerQuery, " +
                 "minimumFee, monthlyQuota).")
    public Stream<Output> createDomain(@Name("domainData") Map<String, Object> domainData) {
        // Validate required fields
        if (!domainData.containsKey("domainName") || !domainData.containsKey("description") ||
            !domainData.containsKey("llmPrompt") || !domainData.containsKey("billing") ||
            !domainData.containsKey("agentDefinitions")) {
            return Stream.of(new Output("undefined", "Domain creation failed: Missing required keys."));
        }

        String domainName = (String) domainData.get("domainName");
        String description = (String) domainData.get("description");
        String llmPrompt = (String) domainData.get("llmPrompt");
        @SuppressWarnings("unchecked")
        Map<String, Object> billing = (Map<String, Object>) domainData.get("billing");
        // agentDefinitions can be a JSON string or Map containing initial agent configurations
        Object agentDefinitions = domainData.get("agentDefinitions");

        // Generate dynamic examples using an enhanced LLM prompt that includes domain context and agent requirements
        String trainingExamples = LLMService.generateExamples(
                llmPrompt + " Provide dynamic training examples that reflect the complete agentic configuration for domain: " + domainName,
                "training",
                domainName);
        String evaluationExamples = LLMService.generateExamples(
                llmPrompt + " Generate evaluation examples that stress-test the dynamic agent capabilities for domain: " + domainName,
                "evaluation",
                domainName);
        String finalExamExample = LLMService.generateExamples(
                llmPrompt + " Produce final exam examples that require full agentic reasoning and integration for domain: " + domainName,
                "finalExam",
                domainName);

        // Create the new domain with dynamic examples and agent definitions
        boolean success = DomainConfigurationManager.createDomain(
                domainName,
                description,
                trainingExamples,
                evaluationExamples,
                finalExamExample,
                billing);

        if (success) {
            return Stream.of(new Output(domainName, "Domain created successfully with LLM-generated examples and dynamic agent definitions"));
        } else {
            return Stream.of(new Output(domainName, "Domain creation failed"));
        }
    }
}
