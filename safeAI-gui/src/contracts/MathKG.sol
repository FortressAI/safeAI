// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./KnowledgeGraphBase.sol";

/**
 * @title MathKG
 * @dev Knowledge graph contract for mathematical concepts
 */
contract MathKG is KnowledgeGraphBase {
    // Structs specific to Math
    struct MathConcept {
        uint256 id;
        string name;
        string description;
        string category;
        string[] prerequisites;
        string notation;
        string formalDefinition;
        string metadata;
        bool exists;
    }

    struct MathProblem {
        uint256 id;
        string title;
        string description;
        string difficulty;
        string solution;
        uint256[] relatedConcepts;
        string metadata;
        bool exists;
    }

    struct MathProof {
        uint256 id;
        string title;
        string description;
        string proofSteps;
        uint256[] relatedConcepts;
        string metadata;
        bool exists;
    }

    // Counters for IDs
    using Counters for Counters.Counter;
    Counters.Counter private _mathConceptIds;
    Counters.Counter private _mathProblemIds;
    Counters.Counter private _mathProofIds;

    // Mappings
    mapping(uint256 => MathConcept) private mathConcepts;
    mapping(uint256 => MathProblem) private mathProblems;
    mapping(uint256 => MathProof) private mathProofs;
    mapping(string => uint256) private conceptNameToId;

    // Events
    event MathConceptAdded(uint256 indexed id, string name, string category);
    event MathConceptUpdated(uint256 indexed id, string name);
    event MathProblemAdded(uint256 indexed id, string title, string difficulty);
    event MathProblemUpdated(uint256 indexed id, string title);
    event MathProofAdded(uint256 indexed id, string title);
    event MathProofUpdated(uint256 indexed id, string title);

    // Modifiers
    modifier mathConceptExists(uint256 conceptId) {
        require(mathConcepts[conceptId].exists, "Math concept does not exist");
        _;
    }

    modifier mathProblemExists(uint256 problemId) {
        require(mathProblems[problemId].exists, "Math problem does not exist");
        _;
    }

    modifier mathProofExists(uint256 proofId) {
        require(mathProofs[proofId].exists, "Math proof does not exist");
        _;
    }

    /**
     * @dev Constructor
     * @param _description A description of the math knowledge graph
     */
    constructor(string memory _description) KnowledgeGraphBase("Mathematics", _description) {
        _mathConceptIds.increment(); // Start IDs from 1
        _mathProblemIds.increment();
        _mathProofIds.increment();
    }

    /**
     * @dev Add a new mathematical concept to the knowledge graph
     * @param name The name of the concept
     * @param description The description of the concept
     * @param category The category (e.g., Algebra, Calculus, Geometry)
     * @param prerequisites Array of prerequisite concept names
     * @param notation The mathematical notation
     * @param formalDefinition The formal definition
     * @param metadata Additional metadata (JSON string)
     * @return The ID of the newly created concept
     */
    function addMathConcept(
        string memory name,
        string memory description,
        string memory category,
        string[] memory prerequisites,
        string memory notation,
        string memory formalDefinition,
        string memory metadata
    ) external onlyOwner whenNotPaused returns (uint256) {
        require(conceptNameToId[name] == 0, "Math concept with this name already exists");
        
        uint256 newConceptId = _mathConceptIds.current();
        
        mathConcepts[newConceptId] = MathConcept({
            id: newConceptId,
            name: name,
            description: description,
            category: category,
            prerequisites: prerequisites,
            notation: notation,
            formalDefinition: formalDefinition,
            metadata: metadata,
            exists: true
        });

        conceptNameToId[name] = newConceptId;
        
        emit MathConceptAdded(newConceptId, name, category);
        
        _mathConceptIds.increment();
        return newConceptId;
    }

    /**
     * @dev Get mathematical concept details
     * @param conceptId The ID of the concept
     * @return The concept details
     */
    function getMathConcept(uint256 conceptId) external view mathConceptExists(conceptId) returns (
        uint256 id,
        string memory name,
        string memory description,
        string memory category,
        string memory notation,
        string memory formalDefinition,
        string memory metadata
    ) {
        MathConcept memory concept = mathConcepts[conceptId];
        return (
            concept.id,
            concept.name,
            concept.description,
            concept.category,
            concept.notation,
            concept.formalDefinition,
            concept.metadata
        );
    }

    /**
     * @dev Get prerequisites for a mathematical concept
     * @param conceptId The ID of the concept
     * @return Array of prerequisite concept names
     */
    function getMathConceptPrerequisites(uint256 conceptId) external view mathConceptExists(conceptId) returns (string[] memory) {
        return mathConcepts[conceptId].prerequisites;
    }

    /**
     * @dev Update mathematical concept metadata
     * @param conceptId The ID of the concept
     * @param metadata The new metadata
     */
    function updateMathConceptMetadata(
        uint256 conceptId,
        string memory metadata
    ) external onlyOwner whenNotPaused mathConceptExists(conceptId) {
        mathConcepts[conceptId].metadata = metadata;
        emit MathConceptUpdated(conceptId, mathConcepts[conceptId].name);
    }

    /**
     * @dev Get concept ID by name
     * @param name The name of the concept
     * @return The ID of the concept
     */
    function getMathConceptIdByName(string memory name) external view returns (uint256) {
        uint256 conceptId = conceptNameToId[name];
        require(conceptId != 0, "Math concept not found");
        return conceptId;
    }

    /**
     * @dev Get the count of mathematical concepts in the knowledge graph
     * @return The count of mathematical concepts
     */
    function getMathConceptCount() external view returns (uint256) {
        return _mathConceptIds.current() - 1;
    }

    /**
     * @dev Add a new math problem to the knowledge graph
     * @param title The title of the problem
     * @param description The description of the problem
     * @param difficulty The difficulty level (e.g., Easy, Medium, Hard)
     * @param solution The solution to the problem
     * @param relatedConcepts Array of related concept IDs
     * @param metadata Additional metadata (JSON string)
     * @return The ID of the newly created problem
     */
    function addMathProblem(
        string memory title,
        string memory description,
        string memory difficulty,
        string memory solution,
        uint256[] memory relatedConcepts,
        string memory metadata
    ) external onlyOwner whenNotPaused returns (uint256) {
        uint256 newProblemId = _mathProblemIds.current();
        
        // Validate that all related concepts exist
        for (uint256 i = 0; i < relatedConcepts.length; i++) {
            require(mathConcepts[relatedConcepts[i]].exists, "Related concept does not exist");
        }
        
        mathProblems[newProblemId] = MathProblem({
            id: newProblemId,
            title: title,
            description: description,
            difficulty: difficulty,
            solution: solution,
            relatedConcepts: relatedConcepts,
            metadata: metadata,
            exists: true
        });
        
        emit MathProblemAdded(newProblemId, title, difficulty);
        
        _mathProblemIds.increment();
        return newProblemId;
    }

    /**
     * @dev Get math problem details
     * @param problemId The ID of the problem
     * @return The problem details
     */
    function getMathProblem(uint256 problemId) external view mathProblemExists(problemId) returns (
        uint256 id,
        string memory title,
        string memory description,
        string memory difficulty,
        string memory solution,
        string memory metadata
    ) {
        MathProblem memory problem = mathProblems[problemId];
        return (
            problem.id,
            problem.title,
            problem.description,
            problem.difficulty,
            problem.solution,
            problem.metadata
        );
    }

    /**
     * @dev Get related concepts for a math problem
     * @param problemId The ID of the problem
     * @return Array of related concept IDs
     */
    function getMathProblemRelatedConcepts(uint256 problemId) external view mathProblemExists(problemId) returns (uint256[] memory) {
        return mathProblems[problemId].relatedConcepts;
    }

    /**
     * @dev Update math problem metadata
     * @param problemId The ID of the problem
     * @param metadata The new metadata
     */
    function updateMathProblemMetadata(
        uint256 problemId,
        string memory metadata
    ) external onlyOwner whenNotPaused mathProblemExists(problemId) {
        mathProblems[problemId].metadata = metadata;
        emit MathProblemUpdated(problemId, mathProblems[problemId].title);
    }

    /**
     * @dev Get the count of math problems in the knowledge graph
     * @return The count of math problems
     */
    function getMathProblemCount() external view returns (uint256) {
        return _mathProblemIds.current() - 1;
    }

    /**
     * @dev Add a new mathematical proof to the knowledge graph
     * @param title The title of the proof
     * @param description The description of the proof
     * @param proofSteps The steps of the proof
     * @param relatedConcepts Array of related concept IDs
     * @param metadata Additional metadata (JSON string)
     * @return The ID of the newly created proof
     */
    function addMathProof(
        string memory title,
        string memory description,
        string memory proofSteps,
        uint256[] memory relatedConcepts,
        string memory metadata
    ) external onlyOwner whenNotPaused returns (uint256) {
        uint256 newProofId = _mathProofIds.current();
        
        // Validate that all related concepts exist
        for (uint256 i = 0; i < relatedConcepts.length; i++) {
            require(mathConcepts[relatedConcepts[i]].exists, "Related concept does not exist");
        }
        
        mathProofs[newProofId] = MathProof({
            id: newProofId,
            title: title,
            description: description,
            proofSteps: proofSteps,
            relatedConcepts: relatedConcepts,
            metadata: metadata,
            exists: true
        });
        
        emit MathProofAdded(newProofId, title);
        
        _mathProofIds.increment();
        return newProofId;
    }

    /**
     * @dev Get math proof details
     * @param proofId The ID of the proof
     * @return The proof details
     */
    function getMathProof(uint256 proofId) external view mathProofExists(proofId) returns (
        uint256 id,
        string memory title,
        string memory description,
        string memory proofSteps,
        string memory metadata
    ) {
        MathProof memory proof = mathProofs[proofId];
        return (
            proof.id,
            proof.title,
            proof.description,
            proof.proofSteps,
            proof.metadata
        );
    }

    /**
     * @dev Get related concepts for a math proof
     * @param proofId The ID of the proof
     * @return Array of related concept IDs
     */
    function getMathProofRelatedConcepts(uint256 proofId) external view mathProofExists(proofId) returns (uint256[] memory) {
        return mathProofs[proofId].relatedConcepts;
    }

    /**
     * @dev Update math proof metadata
     * @param proofId The ID of the proof
     * @param metadata The new metadata
     */
    function updateMathProofMetadata(
        uint256 proofId,
        string memory metadata
    ) external onlyOwner whenNotPaused mathProofExists(proofId) {
        mathProofs[proofId].metadata = metadata;
        emit MathProofUpdated(proofId, mathProofs[proofId].title);
    }

    /**
     * @dev Get the count of math proofs in the knowledge graph
     * @return The count of math proofs
     */
    function getMathProofCount() external view returns (uint256) {
        return _mathProofIds.current() - 1;
    }
} 