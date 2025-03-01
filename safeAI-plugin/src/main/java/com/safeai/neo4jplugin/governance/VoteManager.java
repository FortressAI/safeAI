package com.safeai.neo4jplugin.governance;

/**
 * VoteManager provides additional governance logic for vote tallying.
 */
public class VoteManager {
    public static int tallyVotes(String proposalId) {
        GovernanceProcedures procedures = new GovernanceProcedures();
        return procedures.recordVote(proposalId, 0);
    }
}
