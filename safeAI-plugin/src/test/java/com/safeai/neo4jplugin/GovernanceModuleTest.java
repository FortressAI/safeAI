package com.safeai.neo4jplugin;

import com.safeai.neo4jplugin.governance.GovernanceProcedures;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;

/**
 * Unit tests for GovernanceProcedures.
 */
public class GovernanceModuleTest {
    @Test
    public void testGovernanceVoting() {
        String proposalId = "proposal123";
        int initialVotes = GovernanceProcedures.initiateVote(proposalId);
        int updatedVotes = GovernanceProcedures.recordVote(proposalId, 1);
        assertEquals(initialVotes + 1, updatedVotes);
    }
}
