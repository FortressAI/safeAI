import Web3 from 'web3';
import { ethers } from 'ethers';

class CyberSecurityKGService {
    constructor() {
        this.web3 = null;
        this.contract = null;
        this.initialized = false;
    }

    async initialize() {
        if (this.initialized) return;

        try {
            // Initialize Web3 with MetaMask
            if (window.ethereum) {
                this.web3 = new Web3(window.ethereum);
                await window.ethereum.request({ method: 'eth_requestAccounts' });
            } else {
                throw new Error('Please install MetaMask to interact with the CyberSecurity Knowledge Graph');
            }

            // Initialize contract
            const contractAddress = process.env.REACT_APP_CYBERSECURITY_KG_CONTRACT_ADDRESS;
            
            // Import contract ABI from artifacts
            // This will be available after running 'npm run compile'
            const contractABI = require('../artifacts/contracts/CyberSecurityKG.sol/CyberSecurityKG.json').abi;
            this.contract = new this.web3.eth.Contract(contractABI, contractAddress);
            
            this.initialized = true;
        } catch (error) {
            console.error('Failed to initialize CyberSecurityKGService:', error);
            throw error;
        }
    }

    async getKnowledgeGraph() {
        await this.initialize();
        
        try {
            const [agents, concepts, relationships, vulnerabilities, incidents] = await Promise.all([
                this.getAgents(),
                this.getConcepts(),
                this.getRelationships(),
                this.getVulnerabilities(),
                this.getSecurityIncidents()
            ]);

            return {
                agents,
                concepts,
                relationships,
                vulnerabilities,
                incidents
            };
        } catch (error) {
            console.error('Error fetching knowledge graph:', error);
            throw error;
        }
    }

    async getAgents() {
        await this.initialize();
        try {
            const agentCount = await this.contract.methods.getAgentCount().call();
            const agents = [];

            for (let i = 0; i < agentCount; i++) {
                const agent = await this.contract.methods.getAgent(i + 1).call();
                agents.push({
                    id: agent.id,
                    name: agent.name,
                    category: agent.category,
                    agentType: agent.agentType,
                    usageCount: parseInt(agent.usageCount),
                    successCount: parseInt(agent.successCount),
                    metadata: JSON.parse(agent.metadata),
                    creatorWallet: agent.creatorWallet,
                    transactionFee: parseInt(agent.transactionFee)
                });
            }

            return agents;
        } catch (error) {
            console.error('Error fetching agents:', error);
            throw error;
        }
    }

    async getConcepts() {
        await this.initialize();
        try {
            const conceptCount = await this.contract.methods.getConceptCount().call();
            const concepts = [];

            for (let i = 0; i < conceptCount; i++) {
                const concept = await this.contract.methods.getConcept(i + 1).call();
                concepts.push({
                    id: concept.id,
                    name: concept.name,
                    description: concept.description,
                    metadata: JSON.parse(concept.metadata)
                });
            }

            return concepts;
        } catch (error) {
            console.error('Error fetching concepts:', error);
            throw error;
        }
    }

    async getRelationships() {
        await this.initialize();
        try {
            const relationshipCount = await this.contract.methods.getRelationshipCount().call();
            const relationships = [];

            for (let i = 0; i < relationshipCount; i++) {
                const relationship = await this.contract.methods.getRelationship(i + 1).call();
                relationships.push({
                    id: relationship.id,
                    source: parseInt(relationship.source),
                    target: parseInt(relationship.target),
                    type: relationship.relationType,
                    weight: parseInt(relationship.weight),
                    metadata: JSON.parse(relationship.metadata)
                });
            }

            return relationships;
        } catch (error) {
            console.error('Error fetching relationships:', error);
            throw error;
        }
    }

    async getVulnerabilities() {
        await this.initialize();
        try {
            const vulnerabilityCount = await this.contract.methods.getVulnerabilityCount().call();
            const vulnerabilities = [];

            for (let i = 0; i < vulnerabilityCount; i++) {
                const vulnerability = await this.contract.methods.getVulnerability(i + 1).call();
                vulnerabilities.push({
                    id: vulnerability.id,
                    name: vulnerability.name,
                    description: vulnerability.description,
                    severity: vulnerability.severity,
                    cveId: vulnerability.cveId,
                    discoveryDate: parseInt(vulnerability.discoveryDate),
                    remediation: vulnerability.remediation,
                    metadata: JSON.parse(vulnerability.metadata)
                });
            }

            return vulnerabilities;
        } catch (error) {
            console.error('Error fetching vulnerabilities:', error);
            throw error;
        }
    }

    async getSecurityIncidents() {
        await this.initialize();
        try {
            const incidentCount = await this.contract.methods.getIncidentCount().call();
            const incidents = [];

            for (let i = 0; i < incidentCount; i++) {
                const incident = await this.contract.methods.getSecurityIncident(i + 1).call();
                const relatedVulnerabilities = await this.contract.methods.getIncidentRelatedVulnerabilities(i + 1).call();
                
                incidents.push({
                    id: incident.id,
                    title: incident.title,
                    description: incident.description,
                    date: parseInt(incident.date),
                    impactLevel: incident.impactLevel,
                    relatedVulnerabilities: relatedVulnerabilities.map(id => parseInt(id)),
                    metadata: JSON.parse(incident.metadata)
                });
            }

            return incidents;
        } catch (error) {
            console.error('Error fetching security incidents:', error);
            throw error;
        }
    }

    async addVulnerability(name, description, severity, cveId, discoveryDate, remediation, metadata = {}) {
        await this.initialize();
        
        try {
            const accounts = await this.web3.eth.getAccounts();
            const metadataStr = JSON.stringify(metadata);
            
            const result = await this.contract.methods.addVulnerability(
                name, description, severity, cveId, discoveryDate, remediation, metadataStr
            ).send({ from: accounts[0] });
            
            return result;
        } catch (error) {
            console.error('Error adding vulnerability:', error);
            throw error;
        }
    }

    async addSecurityIncident(title, description, date, impactLevel, relatedVulnerabilities, metadata = {}) {
        await this.initialize();
        
        try {
            const accounts = await this.web3.eth.getAccounts();
            const metadataStr = JSON.stringify(metadata);
            
            const result = await this.contract.methods.addSecurityIncident(
                title, description, date, impactLevel, relatedVulnerabilities, metadataStr
            ).send({ from: accounts[0] });
            
            return result;
        } catch (error) {
            console.error('Error adding security incident:', error);
            throw error;
        }
    }

    async recordAgentUsage(agentId, success) {
        await this.initialize();
        
        try {
            const accounts = await this.web3.eth.getAccounts();
            await this.contract.methods.recordAgentUsage(agentId, success)
                .send({ from: accounts[0] });
        } catch (error) {
            console.error('Error recording agent usage:', error);
            throw error;
        }
    }
}

export default new CyberSecurityKGService(); 