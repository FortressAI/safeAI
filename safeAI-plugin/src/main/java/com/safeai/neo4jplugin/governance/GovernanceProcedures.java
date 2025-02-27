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
    private static Map<String, Integer> proposalVotes = new HashMap<>();

    @UserFunction
    @Description("Initiates a vote for a proposal and returns the initial vote count.")
    public int initiateVote(@Name("proposalId") String proposalId) {
        proposalVotes.put(proposalId, 0);
        return 0;
    }

    @UserFunction
    @Description("Records a vote for a proposal and returns the updated vote count.")
    public int recordVote(@Name("proposalId") String proposalId, @Name("vote") int vote) {
        int currentVotes = proposalVotes.getOrDefault(proposalId, 0);
        currentVotes += vote;
        proposalVotes.put(proposalId, currentVotes);
        return currentVotes;
    }
}
