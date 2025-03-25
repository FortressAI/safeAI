package com.safeai.neo4jplugin;

import com.safeai.neo4jplugin.usage.UsageTracker;
import com.safeai.neo4jplugin.usage.UsageReporting;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * Unit tests for UsageTracker and UsageReporting.
 */
public class UsageModuleTest {
    @Test
    public void testUsageTrackingAndReporting() {
        UsageTracker.recordUsage("node1");
        int count = UsageTracker.getUsageCount("node1");
        assertTrue(count > 0);
        String report = UsageReporting.generateReport();
        assertTrue(report.contains("node1"));
    }
}
