package com.safeai.neo4jplugin;

import com.safeai.neo4jplugin.licensing.TokenPricingEngine;
import com.safeai.neo4jplugin.licensing.RevenueSharingManager;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;

/**
 * Unit tests for licensing module functions.
 */
public class LicensingModuleTest {
    @Test
    public void testTokenCostCalculation() {
        double cost = TokenPricingEngine.calculateTokenCost("node1", 2.0, 1.5);
        assertEquals(30.0, cost, 0.001);
    }

    @Test
    public void testRevenueSharingCalculation() {
        double share = RevenueSharingManager.calculateRevenueShare(100.0, 20.0);
        assertEquals(20.0, share, 0.001);
    }
}
