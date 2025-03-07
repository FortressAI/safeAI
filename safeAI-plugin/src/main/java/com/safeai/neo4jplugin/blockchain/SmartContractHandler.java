package com.safeai.neo4jplugin.blockchain;

/**
 * SmartContractHandler handles deployment and invocation of smart contracts.
 */
public class SmartContractHandler {
    private BlockchainConnector connector;
    
    public SmartContractHandler(BlockchainConnector connector) {
        this.connector = connector;
    }
    
    public String deployContract(String contractBinary) throws Exception {
        // In a full implementation, use web3j to deploy the contract.
        // You can use this.connector to access the BlockchainConnector
        return "0x0000000000000000000000000000000000000000";
    }

    public boolean invokeContractFunction(String contractAddress, String functionName, Object... params) throws Exception {
        // In a full implementation, use web3j to invoke contract functions.
        // You can use this.connector to access the BlockchainConnector
        return true;
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
}

    /**
     * Processes the agent transaction by splitting the fee between the admin and the agent creator.
     *
     * @param userWallet the address of the user who is charged
     * @param agentCreatorWallet the agent creator's wallet address
     * @param fee the total fee amount
     * @param commissionRate the fraction of fee that goes to admin (e.g., 0.05 for 5%)
     * @param adminWallet the admin wallet address
     * @return true if transaction is successful, false otherwise.
     */
    public boolean processAgentTransaction(String userWallet, String agentCreatorWallet, double fee, double commissionRate, String adminWallet) {
        try {
    // Initialize web3j using blockchain endpoint from system property
    String blockchainEndpoint = System.getProperty("blockchain.endpoint");
    if(blockchainEndpoint == null || blockchainEndpoint.isEmpty()){
        throw new RuntimeException("Blockchain endpoint is not set");
    }
    Web3j web3 = Web3j.build(new HttpService(blockchainEndpoint));
    
    // Load admin credentials from environment variable
    String adminKey = System.getenv("ADMIN_WALLET_KEY");
    if(adminKey == null || adminKey.isEmpty()){
        throw new RuntimeException("ADMIN_WALLET_KEY is not set in environment");
    }
    Credentials credentials = Credentials.create(adminKey);
    TransactionManager transactionManager = new RawTransactionManager(web3, credentials);
    
    // Set gas prices using DefaultGasProvider settings
    BigInteger gasPrice = DefaultGasProvider.GAS_PRICE;
    BigInteger gasLimit = DefaultGasProvider.GAS_LIMIT;
    
    // Convert fee and commissionRate to Wei (assuming fee is in ETH)
    BigInteger feeWei = Convert.toWei(BigDecimal.valueOf(fee), Convert.Unit.ETHER).toBigInteger();
    BigInteger commissionRateScaled = Convert.toWei(BigDecimal.valueOf(commissionRate), Convert.Unit.ETHER).toBigInteger();
    
    // Retrieve the smart contract address from system properties
    String contractAddress = System.getProperty("contract.address");
    if(contractAddress == null || contractAddress.isEmpty()){
        throw new RuntimeException("Contract address is not set in system properties");
    }
    
    // Build the contract function call
    Function function = new Function("processAgentTransaction",
            Arrays.<Type>asList(new Address(userWallet),
                                  new Address(agentCreatorWallet),
                                  new Uint256(feeWei),
                                  new Uint256(commissionRateScaled),
                                  new Address(adminWallet)),
            Collections.<TypeReference<?>>emptyList());
    String encodedFunction = FunctionEncoder.encode(function);
    
    // Send the transaction
    EthSendTransaction transactionResponse = transactionManager.sendTransaction(gasPrice, gasLimit, contractAddress, encodedFunction, BigInteger.ZERO);
    if (transactionResponse.hasError()) {
        throw new RuntimeException("Transaction error: " + transactionResponse.getError().getMessage());
    }
    String txHash = transactionResponse.getTransactionHash();
    // Wait for transaction receipt
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
    }

