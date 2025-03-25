package com.safeai.neo4jplugin;

import org.web3j.protocol.Web3j;
import org.web3j.protocol.http.HttpService;
import org.web3j.protocol.core.methods.response.EthBlockNumber;
import org.web3j.protocol.core.methods.response.EthGasPrice;
import java.math.BigInteger;

public class BlockchainModule {
    private Web3j web3j;
    private boolean connected;
    private boolean isTestMode;

    public void initialize(String endpoint) {
        try {
            if (endpoint.startsWith("mock://")) {
                isTestMode = true;
                connected = true;
            } else {
                web3j = Web3j.build(new HttpService(endpoint));
                connected = true;
            }
        } catch (Exception e) {
            connected = false;
            throw new RuntimeException("Failed to initialize blockchain connection", e);
        }
    }

    public boolean isConnected() {
        return connected;
    }

    public BigInteger getBlockNumber() {
        if (isTestMode) {
            return BigInteger.valueOf(1000); // Mock block number for testing
        }
        try {
            EthBlockNumber blockNumber = web3j.ethBlockNumber().send();
            return blockNumber.getBlockNumber();
        } catch (Exception e) {
            throw new RuntimeException("Failed to get block number", e);
        }
    }

    public BigInteger getGasPrice() {
        if (isTestMode) {
            return BigInteger.valueOf(20000000000L); // Mock gas price for testing
        }
        try {
            EthGasPrice gasPrice = web3j.ethGasPrice().send();
            return gasPrice.getGasPrice();
        } catch (Exception e) {
            throw new RuntimeException("Failed to get gas price", e);
        }
    }
} 