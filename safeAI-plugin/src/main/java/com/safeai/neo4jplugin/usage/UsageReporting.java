package com.safeai.neo4jplugin.usage;

import java.util.Map;

/**
 * UsageReporting generates a summary report of usage metrics.
 */
public class UsageReporting {
    public static String generateReport() {
        StringBuilder report = new StringBuilder("Usage Report:\n");
        for (Map.Entry<String, Integer> entry : UsageTracker.usageCounts.entrySet()) {
            report.append("Node ID: ").append(entry.getKey())
                  .append(" - Access Count: ").append(entry.getValue()).append("\n");
        }
        return report.toString();
    }
}
