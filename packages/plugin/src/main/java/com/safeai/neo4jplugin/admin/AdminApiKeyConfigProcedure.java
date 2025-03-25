package com.safeai.neo4jplugin.admin;

import java.util.stream.Stream;

import org.neo4j.procedure.Description;
import org.neo4j.procedure.Mode;
import org.neo4j.procedure.Procedure;

public class AdminApiKeyConfigProcedure {
    public static class Result {
        public String message;
        public Result(String message) {
            this.message = message;
        }
    }

    @Procedure(name = "safeai.configureApiKeys", mode = Mode.READ)
    @Description("Returns instructions on how to securely configure API keys for SafeAI Plugin")
    public Stream<Result> configureApiKeys() {
        String message = "Admin API Key not configured properly. Please follow these steps:\n" +
            "1. Open config/plugin-config.properties\n" +
            "2. Set admin.api.key=your_secure_key\n" +
            "3. Restart the plugin to apply changes";
        return Stream.of(new Result(message));
    }
}
