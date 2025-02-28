# Detailed Agentic KG Documentation: ARC, Math, and Ethics

safeAI is a backend plugin for Neo4j that transforms traditional knowledge graphs into dynamic, agentic systems. This document explains our new paradigm, where each domain-specific KG (ARC, Math, and Ethics) utilizes embedded Groovy scripts to drive the transformation process through three distinct phases: Training, Evaluation, and Final Exam.

## Overview

Our approach leverages dynamic, runtime-executed Groovy code stored within each KG's JSON definition. This enables domain-specific agents to perform:

- **Training Phase:** The KG attempts basic, first-level transformations (e.g. rotations, reflections, translations) that solve simple problems with about a 61% success rate.
- **Evaluation Phase:** If the initial transformations do not yield the expected results, a composite or combinatorial agent applies multiple transformation sequences. This backup mechanism pushes success to 100% and systematically captures a detailed chain-of-thought (CoT).
- **Final Exam Phase:** Using the gathered CoT and validated transformations, the system produces a final answer – a fully transformed output with complete auditability. This final answer is critical for high-stakes evaluation (such as submissions to arcprize.org).

## Domain Details

### ARC Domain

The ARC Domain is our flagship example. It addresses abstract puzzles that require decomposing a problem into fundamental transformations. 

- **Training:** The ARC KG uses Groovy's `trainingScript` to iterate over simple transforms (e.g., 'rotate90', 'rotate180', 'reflectHorizontally', 'reflectVertically'). Each operation is attempted on the input grid to match the expected output.
- **Evaluation:** If none of these operations individually produce the correct answer, the `combinationScript` systematically tests sequences of transformations (e.g., applying 'rotate90' followed by 'translate'). The `evaluationScript` encapsulates this sequence, ensuring that all possibilities are attempted until success is reached.
- **Final Exam:** The `finalExamScript` generates a comprehensive chain-of-thought by invoking the evaluation logic and logging detailed reasoning. This output is used for final submissions and audits.

**Endpoints:**
Our ARC KG JSON includes an `endpoints` section that points to the GitHub data source:
- **Data Folder:** `https://api.github.com/repos/fchollet/ARC/contents/data/`
- **Training Data:** `https://api.github.com/repos/fchollet/ARC/contents/data/training`
- **Evaluation Data:** `https://api.github.com/repos/fchollet/ARC/contents/data/evaluation`
- **Final Exam Data:** `https://api.github.com/repos/fchollet/ARC/contents/data/finalExam`

Domain Creators can update these URLs directly in the KG JSON if the data location changes.

### Math Domain

The Math Domain (Unified "Maths" KG) covers a wide array of mathematical topics including arithmetic, algebra, calculus, geometry, and advanced proofs.

- **Training:** Mathematics agents learn via simple operations (e.g., addition, subtraction) and over time cover more complex functions.
- **Evaluation:** The system tests the consistency of these operations on unseen examples.
- **Final Exam:** For advanced proofs (such as the Fundamental Theorem of Algebra), the KG generates a detailed chain-of-thought that demonstrates each step of the logical reasoning.

The Math KG JSON is similarly structured to ARC, including an `endpoints` block for data access and embedded Groovy scripts that mirror the ARC logic, customized to mathematical operations.

### Ethics Domain

The Ethics Domain is designed to handle ethical guidelines and policies. While the core ethical principles are well-established, external validation via testing is crucial.

- **Training:** Agents in the Ethics KG analyze core ethical theories and compile key guidelines.
- **Evaluation:** The system tests these guidelines against real-world scenarios to ensure they provide adequate resolution.
- **Final Exam:** The final exam phase produces a comprehensive ethical framework along with a chain-of-thought that explains the decision-making process.

Like ARC and Math, the Ethics KG JSON contains an `endpoints` section and embedded Groovy scripts that define its transformation, evaluation, and final exam processes.

## Dynamic Script Integration

Each KG JSON includes a `scripts` section containing Groovy code for the following:

- **trainingScript:** Tries basic, first-level transformations on the input. 
- **combinationScript:** Applies composite transformation strategies if individual operations fail.
- **evaluationScript:** Combines the above to yield a validated output.
- **finalExamScript:** Produces a detailed chain-of-thought along with the final answer.

These scripts are executed at runtime using a GroovyShell, with helper functions (such as `nlQuery`) bound into the execution context.

## Role-Based Interactions

- **Admins:** Maintain full system oversight, configure blockchain and security settings, and review all training/evaluation logs.
- **Domain Creators (KG Creators):** Develop, update, and refine domain-specific KG agents by editing the embedded Groovy scripts and training data. They are responsible for ensuring the endpoints in the JSON remain current if the data source relocates.
- **Users:** Query approved Agentic KGs via natural language interfaces. They benefit from secure, blockchain-backed microtransactions and receive detailed, transparent solutions complete with chain-of-thought for auditability.

## Developer Workflow Guidelines

- **Branching Strategy:** Develop in feature-specific branches. Always merge via pull requests.
- **Endpoint Management:** If the data source for a domain changes, update the corresponding URL in the KG JSON’s `endpoints` section.
- **Testing:** Use the provided deploy script to run end-to-end tests. Monitor CI pipelines to ensure continuous integration.
- **Iterative Improvement:** Review the chain-of-thought outputs to identify areas for refinement in the transformation logic. Update Groovy scripts as necessary.

## Future Directions

- **Enhanced Quantum-Resistant Security:** Continuously update cryptographic measures.
- **Domain Expansion:** Apply this paradigm to additional domains.
- **Dynamic Microtransaction Models:** Refine pricing strategies based on system performance and demand.
- **Continuous Learning:** Implement robust feedback loops to further optimize KG agent accuracy.

## License

This project is licensed as specified in the LICENSE file.

