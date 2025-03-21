import Web3 from 'web3';

class EthicsAuditService {
    constructor() {
        this.auditResults = new Map();
        this.ethicsAgents = {
            baseLanguageGame: null,
            aristotelianEthics: null,
            socraticDialectic: null,
            adaptiveEthics: null,
            compositeEthics: null
        };
    }

    async initialize() {
        // Initialize ethics agents from the Ethics KG
        try {
            const response = await fetch('/api/ethics/agents');
            const agents = await response.json();
            this.ethicsAgents = agents;
            return true;
        } catch (error) {
            console.error('Error initializing ethics agents:', error);
            return false;
        }
    }

    async auditAgent(agent, context = {}) {
        try {
            const auditResults = {
                agentId: agent.name,
                timestamp: new Date().toISOString(),
                evaluations: [],
                overallScore: 0,
                status: 'pending',
                recommendations: [],
                failurePoints: []
            };

            // 1. Language Game Analysis
            const contextResult = await this.runLanguageGameAnalysis(agent);
            auditResults.evaluations.push({
                category: 'Context',
                score: contextResult.score,
                findings: contextResult.findings
            });

            // 2. Aristotelian Ethics Evaluation
            const virtueResult = await this.runAristotelianAnalysis(agent);
            auditResults.evaluations.push({
                category: 'Virtue Ethics',
                score: virtueResult.score,
                findings: virtueResult.findings
            });

            // 3. Socratic Questioning
            const dialecticResult = await this.runSocraticAnalysis(agent);
            auditResults.evaluations.push({
                category: 'Dialectic Reasoning',
                score: dialecticResult.score,
                findings: dialecticResult.findings
            });

            // 4. Adaptive Ethics Learning
            const adaptiveResult = await this.runAdaptiveAnalysis(agent, context);
            auditResults.evaluations.push({
                category: 'Adaptive Ethics',
                score: adaptiveResult.score,
                findings: adaptiveResult.findings
            });

            // 5. Composite Ethics Analysis
            const compositeResult = await this.runCompositeAnalysis(agent, auditResults.evaluations);
            auditResults.evaluations.push({
                category: 'Composite Ethics',
                score: compositeResult.score,
                findings: compositeResult.findings
            });

            // Calculate overall score and status
            auditResults.overallScore = this.calculateOverallScore(auditResults.evaluations);
            auditResults.status = this.determineStatus(auditResults.overallScore);
            auditResults.recommendations = this.generateRecommendations(auditResults);
            auditResults.failurePoints = this.identifyFailurePoints(auditResults);

            // Store results
            this.auditResults.set(agent.name, auditResults);

            // Apply labels to the agent
            await this.applyEthicalLabels(agent, auditResults);

            return auditResults;
        } catch (error) {
            console.error('Error during ethical audit:', error);
            throw error;
        }
    }

    async runLanguageGameAnalysis(agent) {
        try {
            const analysis = await fetch('/api/ethics/language-game', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    agent: agent,
                    criteria: [
                        'contextual_clarity',
                        'linguistic_precision',
                        'semantic_consistency',
                        'cultural_sensitivity'
                    ]
                })
            });
            return await analysis.json();
        } catch (error) {
            console.error('Language game analysis failed:', error);
            return { score: 0, findings: ['Analysis failed: ' + error.message] };
        }
    }

    async runAristotelianAnalysis(agent) {
        try {
            const analysis = await fetch('/api/ethics/aristotelian', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    agent: agent,
                    virtues: [
                        'wisdom',
                        'justice',
                        'courage',
                        'temperance',
                        'responsibility',
                        'benevolence'
                    ]
                })
            });
            return await analysis.json();
        } catch (error) {
            console.error('Aristotelian analysis failed:', error);
            return { score: 0, findings: ['Analysis failed: ' + error.message] };
        }
    }

    async runSocraticAnalysis(agent) {
        try {
            const analysis = await fetch('/api/ethics/socratic', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    agent: agent,
                    questions: [
                        'What are the underlying assumptions?',
                        'What could be the unintended consequences?',
                        'How does this align with established ethical principles?',
                        'What alternatives exist?',
                        'How can potential harm be minimized?'
                    ]
                })
            });
            return await analysis.json();
        } catch (error) {
            console.error('Socratic analysis failed:', error);
            return { score: 0, findings: ['Analysis failed: ' + error.message] };
        }
    }

    async runAdaptiveAnalysis(agent, context) {
        try {
            const analysis = await fetch('/api/ethics/adaptive', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    agent: agent,
                    context: context,
                    criteria: [
                        'learning_capacity',
                        'adaptation_to_feedback',
                        'error_correction',
                        'ethical_consistency'
                    ]
                })
            });
            return await analysis.json();
        } catch (error) {
            console.error('Adaptive analysis failed:', error);
            return { score: 0, findings: ['Analysis failed: ' + error.message] };
        }
    }

    async runCompositeAnalysis(agent, previousEvaluations) {
        try {
            const analysis = await fetch('/api/ethics/composite', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    agent: agent,
                    evaluations: previousEvaluations,
                    criteria: [
                        'consistency',
                        'comprehensiveness',
                        'coherence',
                        'practical_applicability'
                    ]
                })
            });
            return await analysis.json();
        } catch (error) {
            console.error('Composite analysis failed:', error);
            return { score: 0, findings: ['Analysis failed: ' + error.message] };
        }
    }

    calculateOverallScore(evaluations) {
        const weights = {
            'Context': 0.2,
            'Virtue Ethics': 0.25,
            'Dialectic Reasoning': 0.2,
            'Adaptive Ethics': 0.15,
            'Composite Ethics': 0.2
        };

        let weightedSum = 0;
        let totalWeight = 0;

        evaluations.forEach(evaluation => {
            const weight = weights[evaluation.category] || 0;
            weightedSum += evaluation.score * weight;
            totalWeight += weight;
        });

        return totalWeight > 0 ? weightedSum / totalWeight : 0;
    }

    determineStatus(score) {
        if (score >= 0.9) return 'EXCELLENT';
        if (score >= 0.8) return 'GOOD';
        if (score >= 0.7) return 'ACCEPTABLE';
        if (score >= 0.6) return 'NEEDS_IMPROVEMENT';
        return 'FAILED';
    }

    generateRecommendations(auditResults) {
        const recommendations = [];
        const { evaluations, overallScore } = auditResults;

        evaluations.forEach(evaluation => {
            if (evaluation.score < 0.7) {
                recommendations.push({
                    category: evaluation.category,
                    recommendation: `Improve ${evaluation.category.toLowerCase()} implementation. Specific issues: ${evaluation.findings.join(', ')}`
                });
            }
        });

        if (overallScore < 0.7) {
            recommendations.push({
                category: 'Overall',
                recommendation: 'Consider comprehensive ethical review and redesign of agent functionality.'
            });
        }

        return recommendations;
    }

    identifyFailurePoints(auditResults) {
        const failurePoints = [];
        const { evaluations } = auditResults;

        evaluations.forEach(evaluation => {
            if (evaluation.score < 0.6) {
                failurePoints.push({
                    category: evaluation.category,
                    score: evaluation.score,
                    findings: evaluation.findings,
                    severity: 'HIGH'
                });
            }
        });

        return failurePoints;
    }

    async applyEthicalLabels(agent, auditResults) {
        try {
            const labels = {
                ethicalScore: auditResults.overallScore,
                ethicalStatus: auditResults.status,
                lastAuditDate: new Date().toISOString(),
                failurePoints: auditResults.failurePoints.length,
                recommendations: auditResults.recommendations.length,
                categories: auditResults.evaluations.map(e => ({
                    name: e.category,
                    score: e.score
                }))
            };

            await fetch(`/api/agents/${agent.name}/labels`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(labels)
            });

            return true;
        } catch (error) {
            console.error('Error applying ethical labels:', error);
            return false;
        }
    }

    async getAuditHistory(agentName) {
        try {
            const response = await fetch(`/api/ethics/audit-history/${agentName}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching audit history:', error);
            return [];
        }
    }

    async getAgentLabels(agentName) {
        try {
            const response = await fetch(`/api/agents/${agentName}/labels`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching agent labels:', error);
            return null;
        }
    }
}

export default new EthicsAuditService(); 