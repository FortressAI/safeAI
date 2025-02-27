package com.safeai.neo4jplugin;
import java.io.FileInputStream;
import java.util.Properties;
import java.io.IOException;

public class MainPlugin {
    public static void main(String[] args) {
        Properties config = new Properties();
        try {
            config.load(new FileInputStream("config/plugin-config.properties"));
            String apiKey = config.getProperty("admin.api.key", "").trim();
            if(apiKey.isEmpty() || apiKey.contains("${")) {
                System.out.println("WARNING: Secure API Key not set. Please export SAFEAI_API_KEY with a secure value.");
            } else {
                System.out.println("API Key loaded securely.");
            }
            String arcFolder = config.getProperty("arc.kg.folder", "./arc_kg");
            System.out.println("Using ARC KG Folder: " + arcFolder);
        } catch (IOException e) {
            System.out.println("Error reading configuration: " + e.getMessage());
        }
        System.out.println("SafeAI Plugin initialized.");
    }
}
