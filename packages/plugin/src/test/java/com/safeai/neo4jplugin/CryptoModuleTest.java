package com.safeai.neo4jplugin;

import com.safeai.neo4jplugin.crypto.DigitalSignatureUtil;
import org.junit.jupiter.api.Test;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * Unit tests for DigitalSignatureUtil.
 */
public class CryptoModuleTest {
    @Test
    public void testSignAndVerify() throws Exception {
        KeyPairGenerator keyGen = KeyPairGenerator.getInstance("RSA");
        keyGen.initialize(2048);
        KeyPair pair = keyGen.generateKeyPair();

        String data = "Test data";
        String signature = DigitalSignatureUtil.signData(data, pair.getPrivate());
        boolean isValid = DigitalSignatureUtil.verifySignature(data, signature, pair.getPublic());
        assertTrue(isValid, "Signature should be valid.");
    }
}
