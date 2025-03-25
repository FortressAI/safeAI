package com.safeai.neo4jplugin.crypto;

/**
 * QuantumUpgradeable serves as an abstraction layer for cryptographic operations,
 * allowing future upgrades to quantum-resistant algorithms.
 */
public class QuantumUpgradeable {
    public static String signData(String data, Object privateKey) throws Exception {
        return DigitalSignatureUtil.signData(data, (java.security.PrivateKey) privateKey);
    }
    
    public static boolean verifySignature(String data, String signature, Object publicKey) throws Exception {
        return DigitalSignatureUtil.verifySignature(data, signature, (java.security.PublicKey) publicKey);
    }
}
