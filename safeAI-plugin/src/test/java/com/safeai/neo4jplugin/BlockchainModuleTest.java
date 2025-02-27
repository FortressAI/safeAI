package com.safeai.neo4jplugin;

import com.safeai.neo4jplugin.blockchain.BlockchainConnector;
import com.safeai.neo4jplugin.blockchain.SmartContractHandler;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertNotNull;

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
        String contractAddress = SmartContractHandler.deployContract("contractBinaryExample");
        assertNotNull(contractAddress);
    }
}
