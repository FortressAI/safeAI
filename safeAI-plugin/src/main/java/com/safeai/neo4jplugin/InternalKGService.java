package com.safeai.neo4jplugin;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

public class InternalKGService {
    private static final String AUTHORIZED_TOKEN = "AUTHORIZED";
    private static final String[] AVAILABLE_KGS = {
        "Ethics_KG.json",
        "CyberSecurity_KG.json",
        "ARC_Puzzle_Agent_Definitions.json",
        "Foundational_Ethical_KG_Definitions.json",
        "Combinatorics_KG.json",
        "Geometry_KG.json",
        "NumberTheory_KG.json",
        "AdvancedMathProof_KG.json",
        "Math_KG.json"
    };

    private boolean isAuthorized(String token) {
        return AUTHORIZED_TOKEN.equals(token);
    }

    public List<String> listAvailableKGs(String securityToken) {
        if (!isAuthorized(securityToken)) {
            throw new SecurityException("Access denied: invalid security token.");
        }
        List<String> kgs = new ArrayList<>();
        for (String kg : AVAILABLE_KGS) {
            kgs.add(kg);
        }
        return kgs;
    }

    public String readKG(String fileName, String securityToken) {
        if (!isAuthorized(securityToken)) {
            throw new SecurityException("Access denied: invalid security token.");
        }
        boolean valid = false;
        for (String kg : AVAILABLE_KGS) {
            if (kg.equals(fileName)) {
                valid = true;
                break;
            }
        }
        if (!valid) {
            throw new IllegalArgumentException("Requested KG file is not available.");
        }
        InputStream is = getClass().getClassLoader().getResourceAsStream(fileName);
        if (is == null) {
            throw new IllegalArgumentException("File " + fileName + " not found in resources.");
        }
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(is, StandardCharsets.UTF_8))) {
            StringBuilder content = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                content.append(line).append("\n");
            }
            return content.toString();
        } catch (Exception e) {
            throw new RuntimeException("Error reading file " + fileName, e);
        }
    }
}
