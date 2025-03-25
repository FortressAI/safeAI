package com.safeai.neo4jplugin;

import java.util.List;
import java.util.Scanner;

public class InternalKGViewer {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        InternalKGService service = new InternalKGService();

        System.out.print("Enter security token: ");
        String token = scanner.nextLine();

        try {
            List<String> availableKGs = service.listAvailableKGs(token);
            System.out.println("Available Knowledge Graphs:");
            for (String kg : availableKGs) {
                System.out.println("- " + kg);
            }

            System.out.print("Enter the name of the KG file to read (or 'exit' to quit): ");
            String fileName = scanner.nextLine();

            while (!fileName.equalsIgnoreCase("exit")) {
                try {
                    String content = service.readKG(fileName, token);
                    System.out.println("Content of " + fileName + ":");
                    System.out.println(content);
                } catch (Exception e) {
                    System.out.println("Error: " + e.getMessage());
                }
                System.out.print("Enter the name of the KG file to read (or 'exit' to quit): ");
                fileName = scanner.nextLine();
            }
        } catch (SecurityException se) {
            System.out.println("Security exception: " + se.getMessage());
        } finally {
            scanner.close();
        }
    }
}
