// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./KnowledgeGraphBase.sol";

/**
 * @title CyberSecurityKG
 * @dev Knowledge graph contract for cybersecurity domain
 */
contract CyberSecurityKG is KnowledgeGraphBase {
    // Structs specific to CyberSecurity
    struct Vulnerability {
        uint256 id;
        string name;
        string description;
        string severity;
        string cveId;
        uint256 discoveryDate;
        string remediation;
        string metadata;
        bool exists;
    }

    struct SecurityIncident {
        uint256 id;
        string title;
        string description;
        uint256 date;
        string impactLevel;
        uint256[] relatedVulnerabilities;
        string metadata;
        bool exists;
    }

    // Counters for IDs
    using Counters for Counters.Counter;
    Counters.Counter private _vulnerabilityIds;
    Counters.Counter private _incidentIds;

    // Mappings
    mapping(uint256 => Vulnerability) private vulnerabilities;
    mapping(uint256 => SecurityIncident) private incidents;
    mapping(string => uint256) private vulnerabilityNameToId;
    mapping(string => uint256) private cveToVulnerabilityId;

    // Events
    event VulnerabilityAdded(uint256 indexed id, string name, string severity);
    event VulnerabilityUpdated(uint256 indexed id, string name);
    event IncidentAdded(uint256 indexed id, string title, string impactLevel);
    event IncidentUpdated(uint256 indexed id, string title);

    // Modifiers
    modifier vulnerabilityExists(uint256 vulnerabilityId) {
        require(vulnerabilities[vulnerabilityId].exists, "Vulnerability does not exist");
        _;
    }

    modifier incidentExists(uint256 incidentId) {
        require(incidents[incidentId].exists, "Security incident does not exist");
        _;
    }

    /**
     * @dev Constructor
     * @param _description A description of the cybersecurity knowledge graph
     */
    constructor(string memory _description) KnowledgeGraphBase("CyberSecurity", _description) {
        _vulnerabilityIds.increment(); // Start IDs from 1
        _incidentIds.increment();
    }

    /**
     * @dev Add a new vulnerability to the knowledge graph
     * @param name The name of the vulnerability
     * @param description The description of the vulnerability
     * @param severity The severity level (e.g., High, Medium, Low)
     * @param cveId The CVE ID if available
     * @param discoveryDate The date the vulnerability was discovered (Unix timestamp)
     * @param remediation The remediation steps
     * @param metadata Additional metadata (JSON string)
     * @return The ID of the newly created vulnerability
     */
    function addVulnerability(
        string memory name,
        string memory description,
        string memory severity,
        string memory cveId,
        uint256 discoveryDate,
        string memory remediation,
        string memory metadata
    ) external onlyOwner whenNotPaused returns (uint256) {
        require(vulnerabilityNameToId[name] == 0, "Vulnerability with this name already exists");
        
        if (bytes(cveId).length > 0) {
            require(cveToVulnerabilityId[cveId] == 0, "Vulnerability with this CVE ID already exists");
        }
        
        uint256 newVulnerabilityId = _vulnerabilityIds.current();
        
        vulnerabilities[newVulnerabilityId] = Vulnerability({
            id: newVulnerabilityId,
            name: name,
            description: description,
            severity: severity,
            cveId: cveId,
            discoveryDate: discoveryDate,
            remediation: remediation,
            metadata: metadata,
            exists: true
        });

        vulnerabilityNameToId[name] = newVulnerabilityId;
        
        if (bytes(cveId).length > 0) {
            cveToVulnerabilityId[cveId] = newVulnerabilityId;
        }
        
        emit VulnerabilityAdded(newVulnerabilityId, name, severity);
        
        _vulnerabilityIds.increment();
        return newVulnerabilityId;
    }

    /**
     * @dev Get vulnerability details
     * @param vulnerabilityId The ID of the vulnerability
     * @return id The vulnerability's ID
     * @return name The vulnerability's name
     * @return description The vulnerability's description
     * @return severity The severity level
     * @return cveId The CVE ID
     * @return discoveryDate The discovery date
     * @return remediation The remediation steps
     * @return metadata The vulnerability's metadata
     */
    function getVulnerability(uint256 vulnerabilityId) external view vulnerabilityExists(vulnerabilityId) returns (
        uint256 id,
        string memory name,
        string memory description,
        string memory severity,
        string memory cveId,
        uint256 discoveryDate,
        string memory remediation,
        string memory metadata
    ) {
        Vulnerability memory vulnerability = vulnerabilities[vulnerabilityId];
        return (
            vulnerability.id,
            vulnerability.name,
            vulnerability.description,
            vulnerability.severity,
            vulnerability.cveId,
            vulnerability.discoveryDate,
            vulnerability.remediation,
            vulnerability.metadata
        );
    }

    /**
     * @dev Update vulnerability metadata
     * @param vulnerabilityId The ID of the vulnerability
     * @param metadata The new metadata
     */
    function updateVulnerabilityMetadata(
        uint256 vulnerabilityId,
        string memory metadata
    ) external onlyOwner whenNotPaused vulnerabilityExists(vulnerabilityId) {
        vulnerabilities[vulnerabilityId].metadata = metadata;
        emit VulnerabilityUpdated(vulnerabilityId, vulnerabilities[vulnerabilityId].name);
    }

    /**
     * @dev Update vulnerability remediation
     * @param vulnerabilityId The ID of the vulnerability
     * @param remediation The new remediation steps
     */
    function updateVulnerabilityRemediation(
        uint256 vulnerabilityId,
        string memory remediation
    ) external onlyOwner whenNotPaused vulnerabilityExists(vulnerabilityId) {
        vulnerabilities[vulnerabilityId].remediation = remediation;
        emit VulnerabilityUpdated(vulnerabilityId, vulnerabilities[vulnerabilityId].name);
    }

    /**
     * @dev Get vulnerability ID by name
     * @param name The name of the vulnerability
     * @return The ID of the vulnerability
     */
    function getVulnerabilityIdByName(string memory name) external view returns (uint256) {
        uint256 vulnerabilityId = vulnerabilityNameToId[name];
        require(vulnerabilityId != 0, "Vulnerability not found");
        return vulnerabilityId;
    }

    /**
     * @dev Get vulnerability ID by CVE ID
     * @param cveId The CVE ID
     * @return The ID of the vulnerability
     */
    function getVulnerabilityIdByCve(string memory cveId) external view returns (uint256) {
        uint256 vulnerabilityId = cveToVulnerabilityId[cveId];
        require(vulnerabilityId != 0, "Vulnerability not found");
        return vulnerabilityId;
    }

    /**
     * @dev Get the count of vulnerabilities in the knowledge graph
     * @return The count of vulnerabilities
     */
    function getVulnerabilityCount() external view returns (uint256) {
        return _vulnerabilityIds.current() - 1;
    }

    /**
     * @dev Add a new security incident to the knowledge graph
     * @param title The title of the incident
     * @param description The description of the incident
     * @param date The date of the incident (Unix timestamp)
     * @param impactLevel The impact level of the incident
     * @param relatedVulnerabilities Array of related vulnerability IDs
     * @param metadata Additional metadata (JSON string)
     * @return The ID of the newly created incident
     */
    function addSecurityIncident(
        string memory title,
        string memory description,
        uint256 date,
        string memory impactLevel,
        uint256[] memory relatedVulnerabilities,
        string memory metadata
    ) external onlyOwner whenNotPaused returns (uint256) {
        uint256 newIncidentId = _incidentIds.current();
        
        // Validate that all related vulnerabilities exist
        for (uint256 i = 0; i < relatedVulnerabilities.length; i++) {
            require(vulnerabilities[relatedVulnerabilities[i]].exists, "Related vulnerability does not exist");
        }
        
        incidents[newIncidentId] = SecurityIncident({
            id: newIncidentId,
            title: title,
            description: description,
            date: date,
            impactLevel: impactLevel,
            relatedVulnerabilities: relatedVulnerabilities,
            metadata: metadata,
            exists: true
        });
        
        emit IncidentAdded(newIncidentId, title, impactLevel);
        
        _incidentIds.increment();
        return newIncidentId;
    }

    /**
     * @dev Get security incident details
     * @param incidentId The ID of the security incident
     * @return id The incident's ID
     * @return title The incident's title
     * @return description The incident's description
     * @return date The incident's date
     * @return impactLevel The impact level
     * @return relatedVulnerabilities Array of related vulnerability IDs
     * @return metadata The incident's metadata
     */
    function getSecurityIncident(uint256 incidentId) external view incidentExists(incidentId) returns (
        uint256 id,
        string memory title,
        string memory description,
        uint256 date,
        string memory impactLevel,
        uint256[] memory relatedVulnerabilities,
        string memory metadata
    ) {
        SecurityIncident memory incident = incidents[incidentId];
        return (
            incident.id,
            incident.title,
            incident.description,
            incident.date,
            incident.impactLevel,
            incident.relatedVulnerabilities,
            incident.metadata
        );
    }

    /**
     * @dev Get related vulnerabilities for a security incident
     * @param incidentId The ID of the security incident
     * @return Array of related vulnerability IDs
     */
    function getIncidentRelatedVulnerabilities(uint256 incidentId) external view incidentExists(incidentId) returns (uint256[] memory) {
        return incidents[incidentId].relatedVulnerabilities;
    }

    /**
     * @dev Update security incident metadata
     * @param incidentId The ID of the security incident
     * @param metadata The new metadata
     */
    function updateIncidentMetadata(
        uint256 incidentId,
        string memory metadata
    ) external onlyOwner whenNotPaused incidentExists(incidentId) {
        incidents[incidentId].metadata = metadata;
        emit IncidentUpdated(incidentId, incidents[incidentId].title);
    }

    /**
     * @dev Get the count of security incidents in the knowledge graph
     * @return The count of security incidents
     */
    function getIncidentCount() external view returns (uint256) {
        return _incidentIds.current() - 1;
    }
} 