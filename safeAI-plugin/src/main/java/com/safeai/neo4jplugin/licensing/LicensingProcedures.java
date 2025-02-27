package com.safeai.neo4jplugin.licensing;

import org.neo4j.procedure.Description;
import org.neo4j.procedure.Name;
import org.neo4j.procedure.UserFunction;

/**
 * LicensingProcedures expose token-based licensing functions as Neo4j procedures.
 */
public class LicensingProcedures {
    @UserFunction
    @Description("Calculates the token cost for accessing a node based on usage metrics and transformation factors.")
    public double computeTokenCost(@Name("nodeId") String nodeId,
                                   @Name("usageMetric") double usageMetric,
                                   @Name("transformationFactor") double transformationFactor) {
        return TokenPricingEngine.calculateTokenCost(nodeId, usageMetric, transformationFactor);
    }
}
