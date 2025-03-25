package com.safeai.neo4jplugin.licensing;

/**
 * RevenueSharingManager computes revenue sharing amounts from token fees.
 */
public class RevenueSharingManager {
    public static double calculateRevenueShare(double tokenFee, double revenueSharePercentage) {
        return tokenFee * revenueSharePercentage / 100.0;
    }
}
