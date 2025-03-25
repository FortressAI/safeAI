package com.safeai.neo4jplugin

import com.safeai.neo4jplugin.learning.ConversationalAgent
import com.safeai.neo4jplugin.graph_rag.GraphRAG
import groovy.test.GroovyTestCase

class GroovyAgentTest extends GroovyTestCase {
    void testGroovyAgent() {
        def graphRag = new GraphRAG("bolt://localhost:7687", "neo4j", "testpassword")
        def agent = new ConversationalAgent(graphRag)
        def future = agent.startConversation("Hello from Groovy")
        def response = future.join()
        assertNotNull(response)
        graphRag.close()
    }
}
