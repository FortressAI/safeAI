// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title KnowledgeGraphBase
 * @dev Base contract for all knowledge graph smart contracts
 */
contract KnowledgeGraphBase is Ownable, Pausable {
    using Counters for Counters.Counter;

    // Counters for IDs
    Counters.Counter private _agentIds;
    Counters.Counter private _conceptIds;
    Counters.Counter private _relationshipIds;

    // Structs
    struct Agent {
        uint256 id;
        string name;
        string category;
        string agentType;
        uint256 usageCount;
        uint256 successCount;
        string metadata;
        address creatorWallet;
        uint256 transactionFee;
        bool exists;
    }

    struct Concept {
        uint256 id;
        string name;
        string description;
        string[] tags;
        string metadata;
        bool exists;
    }

    struct Relationship {
        uint256 id;
        uint256 source;
        uint256 target;
        string relationType;
        uint256 weight;
        string metadata;
        bool exists;
    }

    // Domain information
    string public domain;
    string public description;

    // Mappings
    mapping(uint256 => Agent) private agents;
    mapping(uint256 => Concept) private concepts;
    mapping(uint256 => Relationship) private relationships;
    mapping(string => uint256) private agentNameToId;
    mapping(string => uint256) private conceptNameToId;

    // Events
    event AgentAdded(uint256 indexed id, string name, string agentType);
    event AgentUpdated(uint256 indexed id, string name);
    event ConceptAdded(uint256 indexed id, string name);
    event ConceptUpdated(uint256 indexed id, string name);
    event RelationshipAdded(uint256 indexed id, uint256 source, uint256 target, string relationType);
    event RelationshipUpdated(uint256 indexed id);

    // Modifiers
    modifier agentExists(uint256 agentId) {
        require(agents[agentId].exists, "Agent does not exist");
        _;
    }

    modifier conceptExists(uint256 conceptId) {
        require(concepts[conceptId].exists, "Concept does not exist");
        _;
    }

    modifier relationshipExists(uint256 relationshipId) {
        require(relationships[relationshipId].exists, "Relationship does not exist");
        _;
    }

    /**
     * @dev Constructor
     * @param _domain The domain of the knowledge graph
     * @param _description A description of the knowledge graph
     */
    constructor(string memory _domain, string memory _description) {
        domain = _domain;
        description = _description;
        
        _agentIds.increment(); // Start IDs from 1
        _conceptIds.increment();
        _relationshipIds.increment();
    }

    // Agent functions
    
    /**
     * @dev Add a new agent to the knowledge graph
     * @param name The name of the agent
     * @param category The category of the agent
     * @param agentType The type of the agent (e.g., Script, LLM)
     * @param metadata Additional metadata for the agent (JSON string)
     * @param creatorWallet The wallet address of the agent creator
     * @param transactionFee The fee charged for using this agent
     * @return The ID of the newly created agent
     */
    function addAgent(
        string memory name,
        string memory category,
        string memory agentType,
        string memory metadata,
        address creatorWallet,
        uint256 transactionFee
    ) external onlyOwner whenNotPaused returns (uint256) {
        require(agentNameToId[name] == 0, "Agent with this name already exists");
        
        uint256 newAgentId = _agentIds.current();
        
        agents[newAgentId] = Agent({
            id: newAgentId,
            name: name,
            category: category,
            agentType: agentType,
            usageCount: 0,
            successCount: 0,
            metadata: metadata,
            creatorWallet: creatorWallet,
            transactionFee: transactionFee,
            exists: true
        });

        agentNameToId[name] = newAgentId;
        
        emit AgentAdded(newAgentId, name, agentType);
        
        _agentIds.increment();
        return newAgentId;
    }

    /**
     * @dev Get agent details
     * @param agentId The ID of the agent
     * @return id The agent's ID
     * @return name The agent's name
     * @return category The agent's category
     * @return agentType The agent's type
     * @return usageCount The number of times the agent has been used
     * @return successCount The number of successful uses
     * @return metadata The agent's metadata
     * @return creatorWallet The wallet address of the agent creator
     * @return transactionFee The fee charged for using this agent
     */
    function getAgent(uint256 agentId) external view agentExists(agentId) returns (
        uint256 id,
        string memory name,
        string memory category,
        string memory agentType,
        uint256 usageCount,
        uint256 successCount,
        string memory metadata,
        address creatorWallet,
        uint256 transactionFee
    ) {
        Agent memory agent = agents[agentId];
        return (
            agent.id,
            agent.name,
            agent.category,
            agent.agentType,
            agent.usageCount,
            agent.successCount,
            agent.metadata,
            agent.creatorWallet,
            agent.transactionFee
        );
    }

    /**
     * @dev Update agent metadata
     * @param agentId The ID of the agent
     * @param metadata The new metadata
     */
    function updateAgentMetadata(
        uint256 agentId,
        string memory metadata
    ) external onlyOwner whenNotPaused agentExists(agentId) {
        agents[agentId].metadata = metadata;
        emit AgentUpdated(agentId, agents[agentId].name);
    }

    /**
     * @dev Record usage of an agent
     * @param agentId The ID of the agent
     * @param success Whether the usage was successful
     */
    function recordAgentUsage(
        uint256 agentId,
        bool success
    ) external onlyOwner whenNotPaused agentExists(agentId) {
        agents[agentId].usageCount += 1;
        if (success) {
            agents[agentId].successCount += 1;
        }
    }

    /**
     * @dev Get agent ID by name
     * @param name The name of the agent
     * @return The ID of the agent
     */
    function getAgentIdByName(string memory name) external view returns (uint256) {
        uint256 agentId = agentNameToId[name];
        require(agentId != 0, "Agent not found");
        return agentId;
    }

    /**
     * @dev Get the count of agents in the knowledge graph
     * @return The count of agents
     */
    function getAgentCount() external view returns (uint256) {
        return _agentIds.current() - 1;
    }

    // Concept functions
    
    /**
     * @dev Add a new concept to the knowledge graph
     * @param name The name of the concept
     * @param conceptDescription The description of the concept
     * @param tags Array of tags associated with the concept
     * @param metadata Additional metadata for the concept (JSON string)
     * @return The ID of the newly created concept
     */
    function addConcept(
        string memory name,
        string memory conceptDescription,
        string[] memory tags,
        string memory metadata
    ) external onlyOwner whenNotPaused returns (uint256) {
        require(conceptNameToId[name] == 0, "Concept with this name already exists");
        
        uint256 newConceptId = _conceptIds.current();
        
        concepts[newConceptId] = Concept({
            id: newConceptId,
            name: name,
            description: conceptDescription,
            tags: tags,
            metadata: metadata,
            exists: true
        });

        conceptNameToId[name] = newConceptId;
        
        emit ConceptAdded(newConceptId, name);
        
        _conceptIds.increment();
        return newConceptId;
    }

    /**
     * @dev Get concept details
     * @param conceptId The ID of the concept
     * @return id The concept's ID
     * @return name The concept's name
     * @return description The concept's description
     * @return tags The concept's tags
     * @return metadata The concept's metadata
     */
    function getConcept(uint256 conceptId) external view conceptExists(conceptId) returns (
        uint256 id,
        string memory name,
        string memory description,
        string[] memory tags,
        string memory metadata
    ) {
        Concept memory concept = concepts[conceptId];
        return (
            concept.id,
            concept.name,
            concept.description,
            concept.tags,
            concept.metadata
        );
    }

    /**
     * @dev Get concept tags
     * @param conceptId The ID of the concept
     * @return Array of tags
     */
    function getConceptTags(uint256 conceptId) external view conceptExists(conceptId) returns (string[] memory) {
        return concepts[conceptId].tags;
    }

    /**
     * @dev Update concept details
     * @param conceptId The ID of the concept
     * @param name The new name of the concept
     * @param conceptDescription The new description of the concept
     * @param tags The new tags array
     * @param metadata The new metadata
     */
    function updateConcept(
        uint256 conceptId,
        string memory name,
        string memory conceptDescription,
        string[] memory tags,
        string memory metadata
    ) external onlyOwner whenNotPaused conceptExists(conceptId) {
        require(conceptNameToId[name] == 0 || conceptNameToId[name] == conceptId, "Concept with this name already exists");
        
        Concept storage concept = concepts[conceptId];
        conceptNameToId[concept.name] = 0;
        concept.name = name;
        concept.description = conceptDescription;
        concept.tags = tags;
        concept.metadata = metadata;
        conceptNameToId[name] = conceptId;
        
        emit ConceptUpdated(conceptId, name);
    }

    /**
     * @dev Get concept ID by name
     * @param name The name of the concept
     * @return The ID of the concept
     */
    function getConceptIdByName(string memory name) external view returns (uint256) {
        uint256 conceptId = conceptNameToId[name];
        require(conceptId != 0, "Concept not found");
        return conceptId;
    }

    /**
     * @dev Get the count of concepts in the knowledge graph
     * @return The count of concepts
     */
    function getConceptCount() external view returns (uint256) {
        return _conceptIds.current() - 1;
    }

    // Relationship functions
    
    /**
     * @dev Add a new relationship to the knowledge graph
     * @param source The ID of the source node
     * @param target The ID of the target node
     * @param relationType The type of relationship
     * @param weight The weight/strength of the relationship
     * @param metadata Additional metadata for the relationship (JSON string)
     * @return The ID of the newly created relationship
     */
    function addRelationship(
        uint256 source,
        uint256 target,
        string memory relationType,
        uint256 weight,
        string memory metadata
    ) external onlyOwner whenNotPaused returns (uint256) {
        uint256 newRelationshipId = _relationshipIds.current();
        
        relationships[newRelationshipId] = Relationship({
            id: newRelationshipId,
            source: source,
            target: target,
            relationType: relationType,
            weight: weight,
            metadata: metadata,
            exists: true
        });

        emit RelationshipAdded(newRelationshipId, source, target, relationType);
        
        _relationshipIds.increment();
        return newRelationshipId;
    }

    /**
     * @dev Get relationship details
     * @param relationshipId The ID of the relationship
     * @return id The relationship's ID
     * @return source The source concept's ID
     * @return target The target concept's ID
     * @return relationType The type of relationship
     * @return weight The weight of the relationship
     * @return metadata The relationship's metadata
     */
    function getRelationship(uint256 relationshipId) external view relationshipExists(relationshipId) returns (
        uint256 id,
        uint256 source,
        uint256 target,
        string memory relationType,
        uint256 weight,
        string memory metadata
    ) {
        Relationship memory relationship = relationships[relationshipId];
        return (
            relationship.id,
            relationship.source,
            relationship.target,
            relationship.relationType,
            relationship.weight,
            relationship.metadata
        );
    }

    /**
     * @dev Update relationship weight
     * @param relationshipId The ID of the relationship
     * @param weight The new weight
     */
    function updateRelationshipWeight(
        uint256 relationshipId,
        uint256 weight
    ) external onlyOwner whenNotPaused relationshipExists(relationshipId) {
        relationships[relationshipId].weight = weight;
        emit RelationshipUpdated(relationshipId);
    }

    /**
     * @dev Update relationship metadata
     * @param relationshipId The ID of the relationship
     * @param metadata The new metadata
     */
    function updateRelationshipMetadata(
        uint256 relationshipId,
        string memory metadata
    ) external onlyOwner whenNotPaused relationshipExists(relationshipId) {
        relationships[relationshipId].metadata = metadata;
        emit RelationshipUpdated(relationshipId);
    }

    /**
     * @dev Get the count of relationships in the knowledge graph
     * @return The count of relationships
     */
    function getRelationshipCount() external view returns (uint256) {
        return _relationshipIds.current() - 1;
    }

    // Admin functions
    
    /**
     * @dev Pause the contract
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Unpause the contract
     */
    function unpause() external onlyOwner {
        _unpause();
    }
} 