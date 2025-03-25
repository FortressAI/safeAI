package com.safeai.neo4jplugin;

import com.safeai.neo4jplugin.aggregation.TransactionAggregator;
import com.safeai.neo4jplugin.aggregation.HashCalculator;
import org.junit.jupiter.api.Test;
import java.util.Arrays;
import static org.junit.jupiter.api.Assertions.assertNotNull;

/**
 * Unit tests for TransactionAggregator and HashCalculator.
 */
public class AggregationModuleTest {
    @Test
    public void testAggregateAndHash() throws Exception {
        String aggregated = TransactionAggregator.aggregateTransactions(Arrays.asList("txn1", "txn2", "txn3"));
        assertNotNull(aggregated);
        String hash = HashCalculator.computeHash(aggregated);
        assertNotNull(hash);
    }
}
