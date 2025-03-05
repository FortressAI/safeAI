package com.safeai.neo4jplugin.admin;

import org.neo4j.procedure.Description;
import org.neo4j.procedure.Procedure;
import org.neo4j.procedure.Mode;
import java.util.stream.Stream;

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
        String msg = "Secure API Key Setup Instructions:\n" +
                     "1. Set an environment variable in your shell: export SAFEAI_API_KEY=your_secure_key\n" +
                     "2. Ensure that config/plugin-config.properties has admin.api.key=${SAFEAI_API_KEY}\n" +
                     "3. For production, consider integrating with a dedicated secrets management system.\n" +
                     "4. Restart Neo4j after updating the API key.";
        return Stream.of(new Result(msg));
    }
}
