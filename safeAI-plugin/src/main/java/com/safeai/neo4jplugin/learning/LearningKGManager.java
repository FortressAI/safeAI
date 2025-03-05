package com.safeai.neo4jplugin.learning;

import com.safeai.neo4jplugin.blockchain.BlockchainConnector;
import com.safeai.neo4jplugin.blockchain.SmartContractHandler;
import com.safeai.neo4jplugin.graph_rag.GraphRAG;
import com.safeai.neo4jplugin.usage.UsageTracker;
import org.apache.http.client.fluent.Request;
import org.apache.http.entity.ContentType;
import org.json.JSONObject;
import java.nio.charset.StandardCharsets;
import java.util.logging.Logger;

/**
 * LearningKGManager handles downloading and initializing the ARC KG for learning.
 * It also deploys smart contracts for low-cost licensing and logs usage.
 */
public class LearningKGManager {
    private static final Logger logger = Logger.getLogger(LearningKGManager.class.getName());
    private GraphRAG graphRag;

    public LearningKGManager(String neo4jUri, String neo4jUser, String neo4jPassword) {
        this.graphRag = new GraphRAG(neo4jUri, neo4jUser, neo4jPassword);
    }

    /**
     * Downloads the ARC KG JSON from the given URL and initializes it in Neo4j.
     * @param url The URL to download the ARC KG JSON.
     * @return true if installation is successful, false otherwise.
     */
    public boolean installARCkg(String url) {
        try {
            logger.info("Loading all Agentic KGs from local resources.");
            ClassLoader classLoader = getClass().getClassLoader();
            File resourcesDirectory = new File(classLoader.getResource("").getFile());
            File[] jsonFiles = resourcesDirectory.listFiles(new FilenameFilter() {
                @Override
                public boolean accept(File dir, String name) {
                    return name.endsWith("_KG.json");
                }
            });
            if (jsonFiles != null && jsonFiles.length > 0) {
                for (File jsonFile : jsonFiles) {
                    logger.info("Loading KG from file: " + jsonFile.getName());
                    String content = new String(java.nio.file.Files.readAllBytes(jsonFile.toPath()), java.nio.charset.StandardCharsets.UTF_8);
                    JSONObject kgData = new JSONObject(content);
                    graphRag.initializeARCkg(kgData);
                }
            } else {
                logger.warning("No KG JSON files found in local resources.");
            }
            String contractAddress = SmartContractHandler.deployContract("contractBinaryExample");
            logger.info("Deployed learning smart contract at: " + contractAddress);
            UsageTracker.recordUsage("LearningKG");
            return true;
        } catch (Exception e) {
            logger.severe("Error installing ARC KG: " + e.getMessage());
            return false;
        }
    }

    public void close() {
        graphRag.close();
    }
}
