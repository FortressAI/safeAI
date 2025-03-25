package com.safeai.neo4jplugin;
import java.io.FileInputStream;
import java.util.Properties;
import java.io.IOException;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.nio.file.Files;
import java.nio.file.Paths;

import com.safeai.neo4jplugin.blockchain.BlockchainConnector;

/**
 * Main entry point for the SafeAI Neo4j Plugin.
 * Handles initialization and configuration for all plugin components.
 */
public class MainPlugin {
    private static final Logger logger = Logger.getLogger(MainPlugin.class.getName());
    private static Properties config = new Properties();
    private static boolean initialized = false;
    
    // Configuration paths to check (in order of preference)
    private static final String[] CONFIG_PATHS = {
        "config/plugin-config.properties",
        "./plugin-config.properties",
        "/conf/plugin-config.properties",  // For Neo4j Docker volume mounts
        System.getProperty("user.home") + "/.safeai/plugin-config.properties"
    };
    
    /**
     * Initialize the plugin with configurations.
     * This method can be called multiple times but will only initialize once.
     * 
     * @return true if initialization was successful, false otherwise
     */
    public static synchronized boolean initialize() {
        if (initialized) {
            logger.info("SafeAI Plugin already initialized.");
            return true;
        }
        
        try {
            // Load configuration
            boolean configLoaded = loadConfiguration();
            if (!configLoaded) {
                logger.warning("Failed to load configuration, using environment variables only.");
            }
            
            // Validate critical configuration
            validateConfiguration();
            
            // Initialize blockchain connector
            String blockchainEndpoint = getConfigProperty("blockchain.endpoint", "");
            if (!blockchainEndpoint.isEmpty()) {
                boolean blockchainInitialized = BlockchainConnector.initialize(blockchainEndpoint);
                if (!blockchainInitialized) {
                    logger.warning("Failed to initialize blockchain connection to: " + blockchainEndpoint);
                    logger.warning("Blockchain features will be disabled.");
                } else {
                    logger.info("Blockchain connector initialized with endpoint: " + blockchainEndpoint);
                }
            } else {
                logger.warning("Blockchain endpoint not configured. Blockchain features will be disabled.");
            }
            
            // Initialize completed
            initialized = true;
            logger.info("SafeAI Plugin initialized successfully.");
            return true;
            
        } catch (Exception e) {
            logger.log(Level.SEVERE, "Error initializing SafeAI Plugin: " + e.getMessage(), e);
            return false;
        }
    }
    
    /**
     * Load configuration from available sources.
     * 
     * @return true if configuration was loaded, false otherwise
     */
    private static boolean loadConfiguration() {
        // Try each config path in order
        for (String configPath : CONFIG_PATHS) {
            try {
                if (Files.exists(Paths.get(configPath))) {
                    logger.info("Loading configuration from: " + configPath);
                    config.load(new FileInputStream(configPath));
                    return true;
                }
            } catch (IOException e) {
                logger.log(Level.WARNING, "Error reading configuration from " + configPath + ": " + e.getMessage(), e);
            }
        }
        
        // If we got here, we didn't load any config file
        logger.warning("No configuration file found. Checked paths: " + String.join(", ", CONFIG_PATHS));
        return false;
    }
    
    /**
     * Validate critical configuration elements.
     */
    private static void validateConfiguration() {
        // Check API keys
        String apiKey = getConfigProperty("openai.api.key", "");
        if (apiKey.isEmpty() || apiKey.contains("${")) {
            logger.warning("OpenAI API Key not set. LLM features will be limited.");
        }
        
        // Check blockchain configuration
        String blockchainEndpoint = getConfigProperty("blockchain.endpoint", "");
        if (blockchainEndpoint.isEmpty() || blockchainEndpoint.contains("${")) {
            logger.warning("Blockchain endpoint not properly configured.");
        }
        
        // Docker-specific checks
        if (blockchainEndpoint.contains("host.docker.internal")) {
            logger.info("Docker environment detected (host.docker.internal in blockchain endpoint)");
            // Ensure Docker environment is properly configured
            if (System.getenv("DOCKER_HOST") != null) {
                logger.info("DOCKER_HOST environment variable found: " + System.getenv("DOCKER_HOST"));
            }
        }
        
        // Other configuration validation can be added here
    }
    
    /**
     * Get a configuration property with fallback to environment variables and default value.
     * 
     * @param key The configuration key
     * @param defaultValue The default value if not found
     * @return The configuration value
     */
    public static String getConfigProperty(String key, String defaultValue) {
        // First check environment variables (highest priority)
        String envKey = key.toUpperCase().replace('.', '_');
        String envValue = System.getenv(envKey);
        if (envValue != null && !envValue.isEmpty()) {
            return envValue;
        }
        
        // Then check system properties
        String sysValue = System.getProperty(key);
        if (sysValue != null && !sysValue.isEmpty()) {
            return sysValue;
        }
        
        // Finally check loaded configuration
        return config.getProperty(key, defaultValue);
    }
    
    /**
     * Main method for direct execution.
     * Primarily used for testing the plugin configuration and initialization.
     */
    public static void main(String[] args) {
        logger.info("SafeAI Plugin initialization test");
        
        boolean success = initialize();
        if (!success) {
            logger.severe("Plugin initialization failed");
            System.exit(1);
        }
        
        // Print key configuration values for verification
        logger.info("Configuration summary:");
        logger.info("- API Key set: " + (!getConfigProperty("openai.api.key", "").isEmpty()));
        logger.info("- Blockchain Endpoint: " + getConfigProperty("blockchain.endpoint", "Not configured"));
        logger.info("- LLM Model: " + getConfigProperty("llm.model", "gpt-4"));
        
        String arcFolder = getConfigProperty("arc.kg.folder", "./arc_kg");
        logger.info("- ARC KG Folder: " + arcFolder);
        
        logger.info("SafeAI Plugin initialization test completed successfully.");
    }
}
