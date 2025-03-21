// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract EthicsKG is Ownable, Pausable {
    using Counters for Counters.Counter;

    // Counters for IDs
    Counters.Counter private _agentIds;
    Counters.Counter private _principleIds;
    Counters.Counter private _relationshipIds;

    // Structs
    struct Agent {
        uint256 id;
        string name;
        string agentType;
        string status;
        uint256 ethicalScore;
        string metadata;
        bool exists;
    }

    struct Principle {
        uint256 id;
        string name;
        string description;
        uint256 weight;
        string metadata;
        bool exists;
    }

    struct Relationship {
        uint256 id;
        uint256 source;
        uint256 target;
        string relationType;
        uint256 strength;
        string metadata;
        bool exists;
    }

    // Mappings
    mapping(uint256 => Agent) private agents;
    mapping(uint256 => Principle) private principles;
    mapping(uint256 => Relationship) private relationships;

    // Events
    event AgentAdded(uint256 indexed id, string name, string agentType);
    event AgentStatusUpdated(uint256 indexed id, string status, uint256 ethicalScore);
    event PrincipleAdded(uint256 indexed id, string name, uint256 weight);
    event RelationshipAdded(uint256 indexed id, uint256 source, uint256 target, string relationType);

    // Modifiers
    modifier agentExists(uint256 agentId) {
        require(agents[agentId].exists, "Agent does not exist");
        _;
    }

    modifier principleExists(uint256 principleId) {
        require(principles[principleId].exists, "Principle does not exist");
        _;
    }

    // Constructor
    constructor() {
        _agentIds.increment(); // Start IDs from 1
        _principleIds.increment();
        _relationshipIds.increment();
    }

    // Agent functions
    function addAgent(
        string memory name,
        string memory agentType,
        string memory metadata
    ) external onlyOwner whenNotPaused returns (uint256) {
        uint256 newAgentId = _agentIds.current();
        
        agents[newAgentId] = Agent({
            id: newAgentId,
            name: name,
            agentType: agentType,
            status: "PENDING",
            ethicalScore: 0,
            metadata: metadata,
            exists: true
        });

        emit AgentAdded(newAgentId, name, agentType);
        
        _agentIds.increment();
        return newAgentId;
    }

    function updateAgentStatus(
        uint256 agentId,
        string memory status,
        uint256 ethicalScore
    ) external onlyOwner whenNotPaused agentExists(agentId) {
        Agent storage agent = agents[agentId];
        agent.status = status;
        agent.ethicalScore = ethicalScore;

        emit AgentStatusUpdated(agentId, status, ethicalScore);
    }

    function getAgent(uint256 agentId) external view agentExists(agentId) returns (
        uint256 id,
        string memory name,
        string memory agentType,
        string memory status,
        uint256 ethicalScore,
        string memory metadata
    ) {
        Agent memory agent = agents[agentId];
        return (
            agent.id,
            agent.name,
            agent.agentType,
            agent.status,
            agent.ethicalScore,
            agent.metadata
        );
    }

    function getAgentCount() external view returns (uint256) {
        return _agentIds.current() - 1;
    }

    // Principle functions
    function addPrinciple(
        string memory name,
        string memory description,
        uint256 weight,
        string memory metadata
    ) external onlyOwner whenNotPaused returns (uint256) {
        uint256 newPrincipleId = _principleIds.current();
        
        principles[newPrincipleId] = Principle({
            id: newPrincipleId,
            name: name,
            description: description,
            weight: weight,
            metadata: metadata,
            exists: true
        });

        emit PrincipleAdded(newPrincipleId, name, weight);
        
        _principleIds.increment();
        return newPrincipleId;
    }

    function getPrinciple(uint256 principleId) external view principleExists(principleId) returns (
        uint256 id,
        string memory name,
        string memory description,
        uint256 weight,
        string memory metadata
    ) {
        Principle memory principle = principles[principleId];
        return (
            principle.id,
            principle.name,
            principle.description,
            principle.weight,
            principle.metadata
        );
    }

    function getPrincipleCount() external view returns (uint256) {
        return _principleIds.current() - 1;
    }

    // Relationship functions
    function addRelationship(
        uint256 source,
        uint256 target,
        string memory relationType,
        uint256 strength,
        string memory metadata
    ) external onlyOwner whenNotPaused agentExists(source) returns (uint256) {
        uint256 newRelationshipId = _relationshipIds.current();
        
        relationships[newRelationshipId] = Relationship({
            id: newRelationshipId,
            source: source,
            target: target,
            relationType: relationType,
            strength: strength,
            metadata: metadata,
            exists: true
        });

        emit RelationshipAdded(newRelationshipId, source, target, relationType);
        
        _relationshipIds.increment();
        return newRelationshipId;
    }

    function getRelationship(uint256 relationshipId) external view returns (
        uint256 id,
        uint256 source,
        uint256 target,
        string memory relationType,
        uint256 strength,
        string memory metadata
    ) {
        require(relationships[relationshipId].exists, "Relationship does not exist");
        Relationship memory relationship = relationships[relationshipId];
        return (
            relationship.id,
            relationship.source,
            relationship.target,
            relationship.relationType,
            relationship.strength,
            relationship.metadata
        );
    }

    function getRelationshipCount() external view returns (uint256) {
        return _relationshipIds.current() - 1;
    }

    // Evaluation functions
    function evaluateAgent(uint256 agentId) external view agentExists(agentId) returns (
        uint256 score,
        string memory status,
        string memory details
    ) {
        Agent memory agent = agents[agentId];
        return (
            agent.ethicalScore,
            agent.status,
            agent.metadata
        );
    }

    // Admin functions
    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }
} 