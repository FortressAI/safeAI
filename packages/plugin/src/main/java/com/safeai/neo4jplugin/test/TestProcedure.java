package com.safeai.neo4jplugin.test;

import org.neo4j.procedure.Description;
import org.neo4j.procedure.Name;
import org.neo4j.procedure.Procedure;
import org.neo4j.procedure.Mode;
import java.util.stream.Stream;

public class TestProcedure {
    public static class StringResult {
        public String value;
        
        public StringResult(String value) {
            this.value = value;
        }
    }
    
    @Procedure(name = "safeai.test.hello", mode = Mode.READ)
    @Description("Test procedure that returns a greeting")
    public Stream<StringResult> hello(@Name("name") String name) {
        return Stream.of(new StringResult("Hello, " + name + "!"));
    }
}
