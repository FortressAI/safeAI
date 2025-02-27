package com.safeai.neo4jplugin;

import com.safeai.neo4jplugin.graph_rag.GraphRAG;
import com.safeai.neo4jplugin.learning.PuzzleSolver;
import org.junit.jupiter.api.Test;
import java.util.Arrays;
import java.util.List;
import static org.junit.jupiter.api.Assertions.assertNotNull;

/**
 * Unit tests for PuzzleSolver in the Learning Module.
 */
public class PuzzleSolverTest {
    @Test
    public void testProcessPuzzle() {
        GraphRAG graphRag = new GraphRAG("bolt://localhost:7687", "neo4j", "testpassword");
        PuzzleSolver solver = new PuzzleSolver(graphRag);
        List<List<Integer>> puzzleGrid = Arrays.asList(
            Arrays.asList(1, 2, 3),
            Arrays.asList(4, 5, 6),
            Arrays.asList(7, 8, 9)
        );
        List<List<Integer>> solution = solver.processPuzzle(puzzleGrid);
        assertNotNull(solution);
        graphRag.close();
    }
}
