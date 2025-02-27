package com.safeai.neo4jplugin.governance;

/**
 * VoteManager provides additional governance logic for vote tallying.
 */
public class VoteManager {
    public static int tallyVotes(String proposalId) {
        return GovernanceProcedures.recordVote(proposalId, 0);
    }
}
