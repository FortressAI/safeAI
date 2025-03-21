import Web3 from 'web3';
import { ethers } from 'ethers';

class EthicsKGService {
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
                throw new Error('Please install MetaMask to interact with the Ethics Knowledge Graph');
            }

            // Initialize contract
            const contractAddress = process.env.REACT_APP_ETHICS_KG_CONTRACT_ADDRESS;
            const contractABI = require('../contracts/EthicsKG.json').abi;
            this.contract = new this.web3.eth.Contract(contractABI, contractAddress);
            
            this.initialized = true;
        } catch (error) {
            console.error('Failed to initialize EthicsKGService:', error);
            throw error;
        }
    }

    async getKnowledgeGraph() {
        await this.initialize();
        
        try {
            const [agents, principles, relationships] = await Promise.all([
                this.getAgents(),
                this.getPrinciples(),
                this.getRelationships()
            ]);

            return {
                agents,
                principles,
                relationships
            };
        } catch (error) {
            console.error('Error fetching knowledge graph:', error);
            throw error;
        }
    }

    async getAgents() {
        try {
            const agentCount = await this.contract.methods.getAgentCount().call();
            const agents = [];

            for (let i = 0; i < agentCount; i++) {
                const agent = await this.contract.methods.getAgent(i).call();
                agents.push({
                    id: agent.id,
                    name: agent.name,
                    type: agent.agentType,
                    status: agent.status,
                    ethicalScore: parseInt(agent.ethicalScore),
                    metadata: JSON.parse(agent.metadata)
                });
            }

            return agents;
        } catch (error) {
            console.error('Error fetching agents:', error);
            throw error;
        }
    }

    async getPrinciples() {
        try {
            const principleCount = await this.contract.methods.getPrincipleCount().call();
            const principles = [];

            for (let i = 0; i < principleCount; i++) {
                const principle = await this.contract.methods.getPrinciple(i).call();
                principles.push({
                    id: principle.id,
                    name: principle.name,
                    description: principle.description,
                    weight: parseInt(principle.weight),
                    metadata: JSON.parse(principle.metadata)
                });
            }

            return principles;
        } catch (error) {
            console.error('Error fetching principles:', error);
            throw error;
        }
    }

    async getRelationships() {
        try {
            const relationshipCount = await this.contract.methods.getRelationshipCount().call();
            const relationships = [];

            for (let i = 0; i < relationshipCount; i++) {
                const relationship = await this.contract.methods.getRelationship(i).call();
                relationships.push({
                    id: relationship.id,
                    source: relationship.source,
                    target: relationship.target,
                    type: relationship.relationType,
                    strength: parseInt(relationship.strength),
                    metadata: JSON.parse(relationship.metadata)
                });
            }

            return relationships;
        } catch (error) {
            console.error('Error fetching relationships:', error);
            throw error;
        }
    }

    async addAgent(name, agentType, metadata = {}) {
        await this.initialize();
        
        try {
            const accounts = await this.web3.eth.getAccounts();
            await this.contract.methods.addAgent(name, agentType, JSON.stringify(metadata))
                .send({ from: accounts[0] });
        } catch (error) {
            console.error('Error adding agent:', error);
            throw error;
        }
    }

    async updateAgentStatus(agentId, status, ethicalScore) {
        await this.initialize();
        
        try {
            const accounts = await this.web3.eth.getAccounts();
            await this.contract.methods.updateAgentStatus(agentId, status, ethicalScore)
                .send({ from: accounts[0] });
        } catch (error) {
            console.error('Error updating agent status:', error);
            throw error;
        }
    }

    async addPrinciple(name, description, weight, metadata = {}) {
        await this.initialize();
        
        try {
            const accounts = await this.web3.eth.getAccounts();
            await this.contract.methods.addPrinciple(name, description, weight, JSON.stringify(metadata))
                .send({ from: accounts[0] });
        } catch (error) {
            console.error('Error adding principle:', error);
            throw error;
        }
    }

    async addRelationship(source, target, type, strength, metadata = {}) {
        await this.initialize();
        
        try {
            const accounts = await this.web3.eth.getAccounts();
            await this.contract.methods.addRelationship(source, target, type, strength, JSON.stringify(metadata))
                .send({ from: accounts[0] });
        } catch (error) {
            console.error('Error adding relationship:', error);
            throw error;
        }
    }

    async evaluateAgent(agentId) {
        await this.initialize();
        
        try {
            const evaluation = await this.contract.methods.evaluateAgent(agentId).call();
            return {
                score: parseInt(evaluation.score),
                status: evaluation.status,
                details: JSON.parse(evaluation.details)
            };
        } catch (error) {
            console.error('Error evaluating agent:', error);
            throw error;
        }
    }
}

export default new EthicsKGService(); 