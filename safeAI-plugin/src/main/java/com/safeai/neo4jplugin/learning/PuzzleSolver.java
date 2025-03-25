package com.safeai.neo4jplugin.learning;

import com.safeai.neo4jplugin.graph_rag.GraphRAG;
import com.safeai.neo4jplugin.specialized_agents.Rotate90Agent;
import java.util.List;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

/**
 * PuzzleSolver processes abstract puzzles (language games) and logs transformation data.
 */
public class PuzzleSolver {
    private static final Logger logger = LogManager.getLogger(PuzzleSolver.class);
    private GraphRAG graphRag;

    public PuzzleSolver(GraphRAG graphRag) {
        this.graphRag = graphRag;
    }

    /**
     * Processes a puzzle represented as a grid by applying transformation agents.
     * @param puzzleGrid The input puzzle grid.
     * @return The solved grid.
     */
    public List<List<Integer>> processPuzzle(List<List<Integer>> puzzleGrid) {
        try {
            // For demonstration, apply Rotate90Agent
            Rotate90Agent agent = new Rotate90Agent(graphRag);
            List<List<Integer>> candidate = agent.generate_candidate(puzzleGrid).get(0);
            logger.info("Puzzle solved using Rotate90Agent.");
            return candidate;
        } catch (Exception e) {
            logger.error("Error processing puzzle: " + e.getMessage());
            return null;
        }
    }
}
