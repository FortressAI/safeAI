import Web3 from 'web3';
import { ethers } from 'ethers';

class MathKGService {
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
                throw new Error('Please install MetaMask to interact with the Mathematics Knowledge Graph');
            }

            // Initialize contract
            const contractAddress = process.env.REACT_APP_MATH_KG_CONTRACT_ADDRESS;
            
            // Import contract ABI from artifacts
            // This will be available after running 'npm run compile'
            const contractABI = require('../artifacts/contracts/MathKG.sol/MathKG.json').abi;
            this.contract = new this.web3.eth.Contract(contractABI, contractAddress);
            
            this.initialized = true;
        } catch (error) {
            console.error('Failed to initialize MathKGService:', error);
            throw error;
        }
    }

    async getKnowledgeGraph() {
        await this.initialize();
        
        try {
            const [agents, concepts, relationships, mathConcepts, mathProblems, mathProofs] = await Promise.all([
                this.getAgents(),
                this.getConcepts(),
                this.getRelationships(),
                this.getMathConcepts(),
                this.getMathProblems(),
                this.getMathProofs()
            ]);

            return {
                agents,
                concepts,
                relationships,
                mathConcepts,
                mathProblems,
                mathProofs
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

    async getMathConcepts() {
        await this.initialize();
        try {
            const conceptCount = await this.contract.methods.getMathConceptCount().call();
            const mathConcepts = [];

            for (let i = 0; i < conceptCount; i++) {
                const concept = await this.contract.methods.getMathConcept(i + 1).call();
                const prerequisites = await this.contract.methods.getMathConceptPrerequisites(i + 1).call();
                
                mathConcepts.push({
                    id: concept.id,
                    name: concept.name,
                    description: concept.description,
                    category: concept.category,
                    prerequisites: prerequisites,
                    notation: concept.notation,
                    formalDefinition: concept.formalDefinition,
                    metadata: JSON.parse(concept.metadata)
                });
            }

            return mathConcepts;
        } catch (error) {
            console.error('Error fetching mathematical concepts:', error);
            throw error;
        }
    }

    async getMathProblems() {
        await this.initialize();
        try {
            const problemCount = await this.contract.methods.getMathProblemCount().call();
            const mathProblems = [];

            for (let i = 0; i < problemCount; i++) {
                const problem = await this.contract.methods.getMathProblem(i + 1).call();
                const relatedConcepts = await this.contract.methods.getMathProblemRelatedConcepts(i + 1).call();
                
                mathProblems.push({
                    id: problem.id,
                    title: problem.title,
                    description: problem.description,
                    difficulty: problem.difficulty,
                    solution: problem.solution,
                    relatedConcepts: relatedConcepts.map(id => parseInt(id)),
                    metadata: JSON.parse(problem.metadata)
                });
            }

            return mathProblems;
        } catch (error) {
            console.error('Error fetching math problems:', error);
            throw error;
        }
    }

    async getMathProofs() {
        await this.initialize();
        try {
            const proofCount = await this.contract.methods.getMathProofCount().call();
            const mathProofs = [];

            for (let i = 0; i < proofCount; i++) {
                const proof = await this.contract.methods.getMathProof(i + 1).call();
                const relatedConcepts = await this.contract.methods.getMathProofRelatedConcepts(i + 1).call();
                
                mathProofs.push({
                    id: proof.id,
                    title: proof.title,
                    description: proof.description,
                    proofSteps: proof.proofSteps,
                    relatedConcepts: relatedConcepts.map(id => parseInt(id)),
                    metadata: JSON.parse(proof.metadata)
                });
            }

            return mathProofs;
        } catch (error) {
            console.error('Error fetching math proofs:', error);
            throw error;
        }
    }

    async addMathConcept(name, description, category, prerequisites, notation, formalDefinition, metadata = {}) {
        await this.initialize();
        
        try {
            const accounts = await this.web3.eth.getAccounts();
            const metadataStr = JSON.stringify(metadata);
            
            const result = await this.contract.methods.addMathConcept(
                name, description, category, prerequisites, notation, formalDefinition, metadataStr
            ).send({ from: accounts[0] });
            
            return result;
        } catch (error) {
            console.error('Error adding math concept:', error);
            throw error;
        }
    }

    async addMathProblem(title, description, difficulty, solution, relatedConcepts, metadata = {}) {
        await this.initialize();
        
        try {
            const accounts = await this.web3.eth.getAccounts();
            const metadataStr = JSON.stringify(metadata);
            
            const result = await this.contract.methods.addMathProblem(
                title, description, difficulty, solution, relatedConcepts, metadataStr
            ).send({ from: accounts[0] });
            
            return result;
        } catch (error) {
            console.error('Error adding math problem:', error);
            throw error;
        }
    }

    async addMathProof(title, description, proofSteps, relatedConcepts, metadata = {}) {
        await this.initialize();
        
        try {
            const accounts = await this.web3.eth.getAccounts();
            const metadataStr = JSON.stringify(metadata);
            
            const result = await this.contract.methods.addMathProof(
                title, description, proofSteps, relatedConcepts, metadataStr
            ).send({ from: accounts[0] });
            
            return result;
        } catch (error) {
            console.error('Error adding math proof:', error);
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

export default new MathKGService(); 