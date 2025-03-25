package com.safeai.neo4jplugin.auth;

/**
 * AuthenticationService handles user authentication.
 * In production, integrate with OAuth 2.0 and MFA.
 */
public class AuthenticationService {
    public static boolean authenticateUser(String username, String password, String token) {
        return username != null && password != null && token != null;
    }
}
