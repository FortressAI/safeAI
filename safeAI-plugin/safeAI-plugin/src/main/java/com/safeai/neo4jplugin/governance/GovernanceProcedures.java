package com.safeai.neo4jplugin.governance;

import org.neo4j.procedure.Description;
import org.neo4j.procedure.Name;
import org.neo4j.procedure.UserFunction;
import java.util.HashMap;
import java.util.Map;

/**
 * GovernanceProcedures expose decentralized governance functions as Neo4j procedures.
 */
public class GovernanceProcedures {
    private static Map<String, Long> proposalVotes = new HashMap<>();

    @UserFunction
    @Description("Initiates a vote for a proposal and returns the initial vote count.")
    public long initiateVote(@Name("proposalId") String proposalId) {
        proposalVotes.put(proposalId, 0L);
        return 0L;
    }

    @UserFunction
    @Description("Records a vote for a proposal and returns the updated vote count.")
    public long recordVote(@Name("proposalId") String proposalId, @Name("vote") long vote) {
        long currentVotes = proposalVotes.getOrDefault(proposalId, 0L);
        currentVotes += vote;
        proposalVotes.put(proposalId, currentVotes);
        return currentVotes;
    }
}
