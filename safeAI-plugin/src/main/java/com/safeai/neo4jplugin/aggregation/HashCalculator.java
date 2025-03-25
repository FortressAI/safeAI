package com.safeai.neo4jplugin.aggregation;

import java.security.MessageDigest;
import java.util.Base64;

/**
 * HashCalculator computes a SHA-256 hash of aggregated data.
 */
public class HashCalculator {
    public static String computeHash(String aggregatedData) throws Exception {
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        byte[] hashBytes = digest.digest(aggregatedData.getBytes("UTF-8"));
        return Base64.getEncoder().encodeToString(hashBytes);
    }
}
