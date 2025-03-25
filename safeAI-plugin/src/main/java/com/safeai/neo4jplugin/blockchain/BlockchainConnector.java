package com.safeai.neo4jplugin.blockchain;

import org.web3j.protocol.Web3j;
import org.web3j.protocol.http.HttpService;
import org.web3j.protocol.core.methods.response.Web3ClientVersion;
import org.web3j.protocol.core.methods.response.EthBlockNumber;

import java.io.FileInputStream;
import java.util.Properties;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;
import okhttp3.OkHttpClient;

import org.neo4j.logging.Log;

/**
 * BlockchainConnector manages the connection to an Ethereum-compatible blockchain
 * with production-ready features like health checks, error handling, and retry logic.
 */
public class BlockchainConnector {
    private static Web3j web3j;
    private static String currentEndpoint;
    private static boolean initialized = false;
    private static final int MAX_RETRIES = 3;
    private static final int RETRY_DELAY_MS = 1000;
    private static final int CONNECTION_TIMEOUT_SECONDS = 30;
    
    private static Log logger;
    
    /**
     * Initialize the blockchain connector with the specified endpoint.
     * 
     * @param endpoint The blockchain endpoint URL
     * @return true if initialization is successful, false otherwise
     */
    public static boolean initialize(String endpoint) {
        return initialize(endpoint, null);
    }
    
    /**
     * Initialize the blockchain connector with the specified endpoint and logger.
     * 
     * @param endpoint The blockchain endpoint URL
     * @param log Logger for outputting diagnostic information
     * @return true if initialization is successful, false otherwise
     */
    public static boolean initialize(String endpoint, Log log) {
        logger = log;
        
        if (endpoint == null || endpoint.trim().isEmpty()) {
            logWarning("No blockchain endpoint provided, trying to load from config");
            endpoint = getEndpointFromConfig();
        }
        
        if (endpoint == null || endpoint.trim().isEmpty()) {
            logError("No blockchain endpoint available after checking config");
            return false;
        }
        
        // Only initialize if not already initialized or if endpoint has changed
        if (web3j != null && initialized && endpoint.equals(currentEndpoint)) {
            logInfo("BlockchainConnector already initialized with endpoint: " + endpoint);
            return true;
        }
        
        // Shutdown existing connection if any
        if (web3j != null) {
            try {
                web3j.shutdown();
                logInfo("Shut down existing web3j connection");
            } catch (Exception e) {
                logWarning("Error shutting down existing web3j connection: " + e.getMessage());
            }
        }
        
        AtomicInteger attempts = new AtomicInteger(0);
        boolean success = false;
        
        while (attempts.incrementAndGet() <= MAX_RETRIES && !success) {
            try {
                logInfo("Initializing BlockchainConnector with endpoint: " + endpoint + " (attempt " + attempts.get() + ")");
                
                // Configure OkHttpClient with timeouts
                OkHttpClient httpClient = new OkHttpClient.Builder()
                    .connectTimeout(CONNECTION_TIMEOUT_SECONDS, TimeUnit.SECONDS)
                    .readTimeout(CONNECTION_TIMEOUT_SECONDS, TimeUnit.SECONDS)
                    .writeTimeout(CONNECTION_TIMEOUT_SECONDS, TimeUnit.SECONDS)
                    .build();
                
                // Create HTTP service with custom client
                HttpService httpService = new HttpService(endpoint, httpClient);
                
                web3j = Web3j.build(httpService);
                
                // Test the connection
                Web3ClientVersion clientVersion = web3j.web3ClientVersion().send();
                String version = clientVersion.getWeb3ClientVersion();
                logInfo("Connected to blockchain node. Client version: " + version);
                
                currentEndpoint = endpoint;
                initialized = true;
                success = true;
                
            } catch (Exception e) {
                if (attempts.get() >= MAX_RETRIES) {
                    logError("Failed to initialize BlockchainConnector after " + MAX_RETRIES + 
                           " attempts: " + e.getMessage());
                    return false;
                } else {
                    logWarning("Failed to initialize BlockchainConnector (attempt " + attempts.get() + 
                             "): " + e.getMessage() + ". Retrying...");
                    try {
                        Thread.sleep(RETRY_DELAY_MS * attempts.get());
                    } catch (InterruptedException ie) {
                        Thread.currentThread().interrupt();
                        logError("Thread interrupted during retry delay");
                        return false;
                    }
                }
            }
        }
        
        return initialized;
    }
    
    /**
     * Get the Web3j instance. Initializes with default endpoint if not already initialized.
     * 
     * @return The Web3j instance
     * @throws IllegalStateException if the connection is not initialized and cannot be initialized
     */
    public static Web3j getWeb3j() {
        if (!initialized) {
            boolean success = initialize(getEndpointFromConfig());
            if (!success) {
                throw new IllegalStateException("BlockchainConnector not initialized. Call initialize() first with a valid endpoint.");
            }
        }
        return web3j;
    }
    
    /**
     * Check if the blockchain connection is healthy.
     * 
     * @return true if the connection is healthy, false otherwise
     */
    public static boolean isHealthy() {
        if (!initialized || web3j == null) {
            return false;
        }
        
        try {
            // Try to get the current block number as a simple health check
            EthBlockNumber blockNumber = web3j.ethBlockNumber().send();
            return blockNumber != null && blockNumber.getBlockNumber() != null;
        } catch (Exception e) {
            logWarning("Blockchain health check failed: " + e.getMessage());
            return false;
        }
    }
    
    /**
     * Reinitialize the connection if it's unhealthy.
     * 
     * @return true if healthy or successfully reinitialized, false otherwise
     */
    public static boolean ensureHealthyConnection() {
        if (isHealthy()) {
            return true;
        }
        
        logWarning("Unhealthy blockchain connection detected, attempting to reinitialize");
        return initialize(currentEndpoint);
    }
    
    /**
     * Shutdown the blockchain connection.
     */
    public static void shutdown() {
        if (web3j != null) {
            try {
                web3j.shutdown();
                initialized = false;
                currentEndpoint = null;
                logInfo("BlockchainConnector shutdown complete");
            } catch (Exception e) {
                logError("Error during BlockchainConnector shutdown: " + e.getMessage());
            }
        }
    }
    
    /**
     * Get the blockchain endpoint from configuration.
     */
    private static String getEndpointFromConfig() {
        try {
            Properties config = new Properties();
            config.load(new FileInputStream("config/plugin-config.properties"));
            String endpoint = config.getProperty("blockchain.endpoint");
            
            // Try environment variable if not in config or if contains placeholder
            if (endpoint == null || endpoint.isEmpty() || endpoint.contains("${")) {
                endpoint = System.getenv("BLOCKCHAIN_ENDPOINT");
            }
            
            return endpoint;
        } catch (Exception e) {
            logWarning("Error loading blockchain endpoint from config: " + e.getMessage());
            return null;
        }
    }
    
    private static void logInfo(String message) {
        if (logger != null) {
            logger.info("[BlockchainConnector] " + message);
        } else {
            System.out.println("[INFO] [BlockchainConnector] " + message);
        }
    }
    
    private static void logWarning(String message) {
        if (logger != null) {
            logger.warn("[BlockchainConnector] " + message);
        } else {
            System.out.println("[WARNING] [BlockchainConnector] " + message);
        }
    }
    
    private static void logError(String message) {
        if (logger != null) {
            logger.error("[BlockchainConnector] " + message);
        } else {
            System.err.println("[ERROR] [BlockchainConnector] " + message);
        }
    }
}
