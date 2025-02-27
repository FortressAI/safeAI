package com.safeai.neo4jplugin.blockchain;

import org.web3j.protocol.Web3j;
import org.web3j.protocol.http.HttpService;

/**
 * BlockchainConnector manages the connection to an Ethereum-compatible blockchain.
 */
public class BlockchainConnector {
    private static Web3j web3j;

    public static void initialize(String endpoint) {
        web3j = Web3j.build(new HttpService(endpoint));
    }

    public static Web3j getWeb3j() {
        return web3j;
    }
}
