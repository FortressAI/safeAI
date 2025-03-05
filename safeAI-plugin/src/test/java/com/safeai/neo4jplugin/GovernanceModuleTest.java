package com.safeai.neo4jplugin;

import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.Test;

import com.safeai.neo4jplugin.governance.GovernanceProcedures;

/**
 * Unit tests for GovernanceProcedures.
 */
public class GovernanceModuleTest {
    @Test
    public void testGovernanceVoting() {
        String proposalId = "proposal123";
        GovernanceProcedures governance = new GovernanceProcedures();
        long initialVotes = governance.initiateVote(proposalId);
        long updatedVotes = governance.recordVote(proposalId, 1);
        assertEquals(initialVotes + 1, updatedVotes);
    }
}
