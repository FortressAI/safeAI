package com.safeai.neo4jplugin;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import org.junit.jupiter.api.Test;

import com.safeai.neo4jplugin.blockchain.BlockchainConnector;
import com.safeai.neo4jplugin.blockchain.SmartContractHandler;

/**
 * Unit tests for BlockchainConnector and SmartContractHandler.
 */
public class BlockchainModuleTest {
    @Test
    public void testBlockchainConnection() {
        BlockchainConnector.initialize("https://test-blockchain.example.com");
        assertNotNull(BlockchainConnector.getWeb3j());
    }

    @Test
    public void testDeployContract() throws Exception {
        // First initialize the blockchain connector
        BlockchainConnector.initialize("https://test-blockchain.example.com");
        
        // Create a new SmartContractHandler instance
        // Note: You'll need to modify BlockchainConnector to have a constructor
        // or modify SmartContractHandler to accept a different parameter
        BlockchainConnector connector = new BlockchainConnector();
        SmartContractHandler handler = new SmartContractHandler(connector);
        
        // Call the instance method
        String contractAddress = handler.deployContract("contractBinaryExample");
        assertNotNull(contractAddress);
    }
}
