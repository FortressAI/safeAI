package com.safeai.neo4jplugin.blockchain;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.http.HttpService;
import org.web3j.crypto.Credentials;
import org.web3j.tx.TransactionManager;
import org.web3j.tx.RawTransactionManager;
import org.web3j.tx.gas.DefaultGasProvider;
import org.web3j.utils.Convert;
import org.web3j.abi.FunctionEncoder;
import org.web3j.abi.datatypes.Function;
import org.web3j.abi.datatypes.Address;
import org.web3j.abi.datatypes.generated.Uint256;
import org.web3j.protocol.core.methods.response.EthSendTransaction;
import org.web3j.protocol.core.methods.response.TransactionReceipt;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.Arrays;
import java.util.Collections;

/**
 * SmartContractHandler handles deployment and invocation of smart contracts.
 */
public class SmartContractHandler {
    private BlockchainConnector connector;
    private static final ExecutorService executor = Executors.newCachedThreadPool();
    
    public SmartContractHandler(BlockchainConnector connector) {
        this.connector = connector;
    }
    
    public CompletableFuture<String> deployContract(String contractBinary) {
        return CompletableFuture.supplyAsync(() -> {
            // In a full implementation, use web3j to deploy the contract.
            // You can use this.connector to access the BlockchainConnector
            return "0x0000000000000000000000000000000000000000";
        }, executor);
    }
    
    public CompletableFuture<Boolean> invokeContractFunction(String contractAddress, String functionName, Object... params) {
        return CompletableFuture.supplyAsync(() -> {
            // In a full implementation, use web3j to invoke contract functions.
            // You can use this.connector to access the BlockchainConnector
            return true;
        }, executor);
    }
    
    // Keep the static methods for backward compatibility
    public static String deployContractStatic(String contractBinary) throws Exception {
        // In a full implementation, use web3j to deploy the contract.
        return "0x0000000000000000000000000000000000000000";
    }
    
    public static boolean invokeContractFunctionStatic(String contractAddress, String functionName, Object... params) throws Exception {
        // In a full implementation, use web3j to invoke contract functions.
        return true;
    }
    
    /**
     * Processes the agent transaction by splitting the fee between the admin and the agent creator.
     *
     * @param userWallet the address of the user who is charged
     * @param agentCreatorWallet the agent creator's wallet address
     * @param fee the total fee amount
     * @param commissionRate the fraction of fee that goes to admin (e.g., 0.05 for 5%)
     * @param adminWallet the admin wallet address
     * @return a CompletableFuture that resolves to true if transaction is successful, false otherwise.
     */
    public CompletableFuture<Boolean> processAgentTransaction(String userWallet, String agentCreatorWallet, double fee, double commissionRate, String adminWallet) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                String blockchainEndpoint = System.getProperty("blockchain.endpoint");
                if (blockchainEndpoint == null || blockchainEndpoint.isEmpty()){
                    throw new RuntimeException("Blockchain endpoint is not set");
                }
                Web3j web3 = Web3j.build(new HttpService(blockchainEndpoint));
                
                String adminKey = System.getenv("ADMIN_WALLET_KEY");
                if (adminKey == null || adminKey.isEmpty()){
                    throw new RuntimeException("ADMIN_WALLET_KEY is not set in environment");
                }
                Credentials credentials = Credentials.create(adminKey);
                TransactionManager transactionManager = new RawTransactionManager(web3, credentials);
                
                BigInteger gasPrice = DefaultGasProvider.GAS_PRICE;
                BigInteger gasLimit = DefaultGasProvider.GAS_LIMIT;
                
                BigInteger feeWei = Convert.toWei(BigDecimal.valueOf(fee), Convert.Unit.ETHER).toBigInteger();
                BigInteger commissionRateScaled = Convert.toWei(BigDecimal.valueOf(commissionRate), Convert.Unit.ETHER).toBigInteger();
                
                String contractAddress = System.getProperty("contract.address");
                if (contractAddress == null || contractAddress.isEmpty()){
                    throw new RuntimeException("Contract address is not set in system properties");
                }
                
                Function function = new Function("processAgentTransaction",
                        Arrays.asList(new Address(userWallet),
                                      new Address(agentCreatorWallet),
                                      new Uint256(feeWei),
                                      new Uint256(commissionRateScaled),
                                      new Address(adminWallet)),
                        Collections.emptyList());
                String encodedFunction = FunctionEncoder.encode(function);
                
                EthSendTransaction transactionResponse = transactionManager.sendTransaction(gasPrice, gasLimit, contractAddress, encodedFunction, BigInteger.ZERO);
                if (transactionResponse.hasError()) {
                    throw new RuntimeException("Transaction error: " + transactionResponse.getError().getMessage());
                }
                String txHash = transactionResponse.getTransactionHash();
                TransactionReceipt receipt = web3.ethGetTransactionReceipt(txHash).send().getTransactionReceipt()
                        .orElseThrow(() -> new RuntimeException("Transaction receipt not found"));
                if (!receipt.getStatus().equals("0x1")) {
                    throw new RuntimeException("Transaction failed with status: " + receipt.getStatus());
                }
                return true;
            } catch (Exception e) {
                System.err.println("Transaction failed: " + e.getMessage());
                return false;
            }
        }, executor);
    }
}
