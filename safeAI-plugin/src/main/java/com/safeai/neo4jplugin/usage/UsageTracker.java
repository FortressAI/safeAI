package com.safeai.neo4jplugin.usage;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

/**
 * UsageTracker logs usage events for nodes in the knowledge graph.
 */
public class UsageTracker {
    private static Map<String, Integer> usageCounts = new HashMap<>();

    public static void recordUsage(String nodeId) {
        usageCounts.put(nodeId, usageCounts.getOrDefault(nodeId, 0) + 1);
        System.out.println("Access recorded for node " + nodeId + " at " + Instant.now());
    }

    public static int getUsageCount(String nodeId) {
        return usageCounts.getOrDefault(nodeId, 0);
    }

    public static Map<String, Integer> getUsageCounts() {
        return usageCounts;
    }
}
