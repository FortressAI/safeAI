package com.safeai.neo4jplugin;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;
import java.math.BigInteger;

public class BlockchainModuleTest {
    private BlockchainModule blockchainModule;
    
    @BeforeEach
    void setUp() {
        blockchainModule = new BlockchainModule();
        // Use a mock endpoint for testing
        blockchainModule.initialize("mock://localhost:8545");
    }
    
    @Test
    void testBlockchainConnection() {
        assertTrue(blockchainModule.isConnected());
    }
    
    @Test
    void testBlockchainOperations() {
        // Test basic blockchain operations with mocked values
        BigInteger blockNumber = blockchainModule.getBlockNumber();
        assertNotNull(blockNumber);
        assertTrue(blockNumber.compareTo(BigInteger.ZERO) >= 0);
        
        BigInteger gasPrice = blockchainModule.getGasPrice();
        assertNotNull(gasPrice);
        assertTrue(gasPrice.compareTo(BigInteger.ZERO) > 0);
    }
}
