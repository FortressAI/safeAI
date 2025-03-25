package com.safeai.neo4jplugin.aggregation;

import java.util.List;

/**
 * TransactionAggregator aggregates a list of transactions into a single string.
 */
public class TransactionAggregator {
    public static String aggregateTransactions(List<String> transactions) {
        StringBuilder sb = new StringBuilder();
        for (String txn : transactions) {
            sb.append(txn).append("|");
        }
        return sb.toString();
    }
}
