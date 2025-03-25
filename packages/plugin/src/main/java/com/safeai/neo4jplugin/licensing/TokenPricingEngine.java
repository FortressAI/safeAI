package com.safeai.neo4jplugin.licensing;

/**
 * TokenPricingEngine calculates token costs based on usage metrics.
 */
public class TokenPricingEngine {
    public static double calculateTokenCost(String nodeId, double usageMetric, double transformationFactor) {
        double baseCost = 10.0;
        return baseCost * usageMetric * transformationFactor;
    }
}
