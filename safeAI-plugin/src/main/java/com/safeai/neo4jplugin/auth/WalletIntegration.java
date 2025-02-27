package com.safeai.neo4jplugin.auth;

/**
 * WalletIntegration links user accounts to blockchain wallet addresses.
 */
public class WalletIntegration {
    public static String linkWallet(String userId, String walletAddress) {
        return "Wallet linked for user " + userId + ": " + walletAddress;
    }
}
