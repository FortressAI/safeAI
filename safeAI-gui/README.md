# SafeAI Management Console: Comprehensive User Manual

A modern, user-friendly web interface for managing the SafeAI Neo4j plugin and interacting with decentralized Knowledge Graphs. This comprehensive platform provides tools for working with Agentic Knowledge Graphs, creating and managing agents, monitoring security, and leveraging blockchain technology for transparent AI governance.

## Table of Contents

1. [System Overview](#system-overview)
2. [Architecture](#architecture)
3. [Prerequisites](#prerequisites)
4. [Local Development Setup](#local-development-setup)
5. [Knowledge Graph Contracts](#knowledge-graph-contracts)
6. [Frontend Services](#frontend-services)
7. [Running Locally](#running-locally)
8. [Production Deployment on AWS](#production-deployment-on-aws)
9. [Connecting to safeAIcoin.com Blockchain](#connecting-to-safeaicoincom-blockchain)
10. [User Guides](#user-guides)
    - [Dashboard](#dashboard)
    - [Ethics Knowledge Graph](#ethics-knowledge-graph)
    - [CyberSecurity Knowledge Graph](#cybersecurity-knowledge-graph)
    - [Math Knowledge Graph](#math-knowledge-graph)
    - [FreePress Decentralized News](#freepress-decentralized-news)
    - [Agent Workshop](#agent-workshop)
    - [Security Center](#security-center)
    - [Settings](#settings)
11. [Troubleshooting](#troubleshooting)
12. [Contributing](#contributing)
13. [License](#license)

## System Overview

SafeAI Management Console serves as the centralized interface for interacting with various Knowledge Graphs (KGs) deployed on the blockchain. The system combines:

- **Decentralized Knowledge Graphs**: Smart contract-based KGs for various domains
- **Blockchain Integration**: Transparent, immutable record of AI decisions and knowledge
- **IPFS Integration**: Decentralized storage for content and larger data structures
- **Neo4j Plugin Integration**: Advanced graph database capabilities
- **Web3 Capabilities**: Connect with decentralized wallets and blockchain networks

The platform empowers users to:
- Create, audit, and interact with AI agents
- Develop and expand domain-specific knowledge
- Track AI decision-making with complete transparency
- Ensure ethical compliance of AI systems
- Publish and consume content in a decentralized manner
- Deploy secure, blockchain-verified AI capabilities

## Architecture

The SafeAI Management Console is built using:

### Frontend Technologies
- **React**: JavaScript library for building user interfaces
- **Material-UI**: Component library implementing Google's Material Design
- **React Router**: Client-side routing
- **Recharts**: Data visualization
- **Web3.js/ethers.js**: Blockchain interaction

### Backend Technologies
- **Hardhat**: Ethereum development environment
- **Solidity**: Smart contract programming language
- **IPFS**: Decentralized storage
- **Neo4j**: Graph database (integration with SafeAI plugin)

### Blockchain Stack
- **Ethereum/Compatible Networks**: For deploying knowledge graph contracts
- **OpenZeppelin**: Security standards for smart contracts
- **MetaMask**: Wallet integration
- **safeAIcoin.com**: Custom blockchain infrastructure

### Knowledge Graphs
The system uses several specialized knowledge graphs:
- **Ethics KG**: Ethical frameworks and agent evaluation
- **CyberSecurity KG**: Security vulnerabilities and incidents
- **Math KG**: Mathematical concepts, problems, and proofs
- **FreePress**: Decentralized content publishing and consumption

## Prerequisites

Before setting up the SafeAI Management Console, ensure you have:

- **Node.js**: Version 16.x or later
  ```bash
  # Check installed version
  node --version
  ```

- **npm**: Version 8.x or later
  ```bash
  # Check installed version
  npm --version
  ```

- **Git**: For source code management
  ```bash
  # Check installed version
  git --version
  ```

- **MetaMask**: Browser extension for blockchain interaction
  - Install from [metamask.io](https://metamask.io/)
  - Set up a wallet and secure your seed phrase
  - Add test networks if needed (Sepolia, Mumbai)

- **AWS Account**: For production deployment
  - Create an account at [aws.amazon.com](https://aws.amazon.com)
  - Set up IAM user with appropriate permissions
  - Configure AWS CLI with your credentials

- **Docker and Docker Compose**: For local blockchain development (optional)
  ```bash
  # Check installed versions
  docker --version
  docker-compose --version
  ```

- **SafeAI Neo4j Plugin**: Running instance (optional)
  - Follow installation instructions from main SafeAI repository

## Local Development Setup

Follow these steps to set up your local development environment:

1. **Clone the Repository**
   ```bash
   git clone https://github.com/FortressAI/safeAI.git
   cd safeAI/safeAI-gui
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Create Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Edit the `.env` file with your configuration:
   ```
   # Network RPC URLs
   SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/your-infura-key
   MUMBAI_RPC_URL=https://polygon-mumbai.infura.io/v3/your-infura-key
   POLYGON_RPC_URL=https://polygon-mainnet.infura.io/v3/your-infura-key

   # Deployment account private key (without 0x prefix)
   PRIVATE_KEY=your_private_key_here

   # API Keys for verification
   ETHERSCAN_API_KEY=your_etherscan_api_key
   POLYGONSCAN_API_KEY=your_polygonscan_api_key

   # Contract addresses - to be filled after deployment
   REACT_APP_ETHICS_KG_CONTRACT_ADDRESS=
   REACT_APP_CYBERSECURITY_KG_CONTRACT_ADDRESS=
   REACT_APP_MATH_KG_CONTRACT_ADDRESS=
   REACT_APP_FREEPRESS_CONTRACT_ADDRESS=

   # IPFS Configuration
   REACT_APP_IPFS_API_URL=https://ipfs.infura.io:5001
   REACT_APP_IPFS_PROJECT_ID=your_infura_ipfs_project_id
   REACT_APP_IPFS_PROJECT_SECRET=your_infura_ipfs_project_secret
   REACT_APP_IPFS_GATEWAY=https://ipfs.io/ipfs/
   ```

4. **Start Local Blockchain (Optional)**
   If you want to test with a local blockchain:
   ```bash
   npm run node
   ```
   This starts a Hardhat node on http://localhost:8545

5. **Compile Smart Contracts**
   ```bash
   npm run compile
   ```
   This will compile all the Solidity contracts in the `src/contracts` directory

6. **Deploy Contracts to Local Network**
   ```bash
   npm run deploy:local
   ```
   Copy the generated contract addresses and update your `.env` file

7. **Start Development Server**
   ```bash
   npm start
   ```
   The application will be available at http://localhost:3000

## Knowledge Graph Contracts

The SafeAI ecosystem utilizes several specialized smart contracts for different knowledge domains:

### Base Knowledge Graph Contract

The `KnowledgeGraphBase.sol` contract provides the foundation for all domain-specific knowledge graphs. It includes:

- Agent management: Create and manage AI agents
- Concept management: Define knowledge concepts
- Relationship management: Connect concepts and agents
- Access control: Secure operations with ownership
- Pause mechanism: Emergency stop for all operations

### Domain-Specific Contracts

1. **Ethics Knowledge Graph (EthicsKG.sol)**
   - Ethical principles management
   - Agent ethical evaluation
   - Status tracking and scoring
   - Ethical labeling of agents

2. **CyberSecurity Knowledge Graph (CyberSecurityKG.sol)**
   - Vulnerability tracking
   - Security incident recording
   - CVE integration
   - Remediation guidance

3. **Math Knowledge Graph (MathKG.sol)**
   - Mathematical concept representation
   - Problem and proof management
   - Concept prerequisites tracking
   - Formal definitions and notations

4. **FreePress Contract (FreePressContract.sol)**
   - Decentralized content publishing
   - IPFS integration for content storage
   - Licensing and micropayments
   - Author verification

### Deploying Contracts

The system includes deployment scripts for all contracts:

```bash
# Deploy all knowledge graphs to local network
npm run deploy:local

# Deploy to Sepolia test network
npm run deploy:sepolia

# Deploy to Mumbai test network
npm run deploy:mumbai

# Deploy only Ethics KG to local network
npm run deploy:ethics:local
```

After deployment, the terminal will output contract addresses to add to your `.env` file.

## Frontend Services

The application uses service classes to interact with smart contracts:

### Ethics KG Service

`EthicsKGService.js` provides methods for:
- Getting the complete knowledge graph
- Retrieving agents, principles, and relationships
- Adding new agents and principles
- Updating agent ethical status
- Evaluating agents against ethical frameworks

### CyberSecurity KG Service

`CyberSecurityKGService.js` offers:
- Fetching vulnerabilities and security incidents
- Adding new vulnerabilities with CVE information
- Recording security incidents
- Tracking agent usage statistics

### Math KG Service

`MathKGService.js` includes functionality for:
- Managing mathematical concepts
- Adding problems and proofs
- Connecting concepts with prerequisites
- Tracking related concepts for problems

### FreePress Service

`FreePressService.js` enables:
- Publishing content to IPFS and blockchain
- Content licensing and micropayments
- Retrieving and updating articles
- Managing publisher profiles

### Ethics Audit Service

`EthicsAuditService.js` provides:
- Comprehensive agent auditing
- Multiple ethical framework analyses
- Ethical labeling
- Failure point identification

### IPFS Service

`IPFSService.js` offers:
- Decentralized content upload
- Content retrieval
- Metadata management
- Gateway URL generation

## Running Locally

To run the SafeAI Management Console locally:

1. **Start the Development Server**
   ```bash
   npm start
   ```

2. **Connect MetaMask**
   - Open the application at http://localhost:3000
   - When prompted, connect your MetaMask wallet
   - Ensure you're on the correct network (local, Sepolia, Mumbai)

3. **Interact with Knowledge Graphs**
   - Navigate to different sections using the sidebar
   - Connect to the blockchain when prompted
   - Explore and interact with different knowledge domains

4. **Local Testing Workflow**
   - Make changes to the code
   - Test functionality in the browser
   - Use React Developer Tools for debugging
   - Monitor blockchain interactions in MetaMask

5. **Working with Local Blockchain**
   - Use the Hardhat console for debugging:
     ```bash
     npx hardhat console --network localhost
     ```
   - Import test accounts into MetaMask using the private keys
   - Fund test accounts if needed:
     ```bash
     npx hardhat --network localhost faucet <address>
     ```

## Production Deployment on AWS

### Architecture Overview

For production deployment, we recommend a secure AWS architecture:
- **Frontend**: Hosted on Amazon S3 with CloudFront CDN
- **Blockchain Node**: EC2 instance or managed service
- **CI/CD**: AWS CodePipeline for automated deployments
- **Security**: WAF, Shield, and IAM for comprehensive protection

### Deployment Steps

1. **Build Production Bundle**
   ```bash
   npm run build
   ```
   This creates optimized assets in the `build` directory

2. **Create AWS S3 Bucket**
   ```bash
   aws s3 mb s3://safeai-management-console-prod
   ```

3. **Configure S3 for Web Hosting**
   ```bash
   aws s3 website s3://safeai-management-console-prod \
     --index-document index.html \
     --error-document index.html
   ```

4. **Set Bucket Policy for Public Access**
   Create a file named `bucket-policy.json`:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Principal": "*",
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::safeai-management-console-prod/*"
       }
     ]
   }
   ```

   Apply the policy:
   ```bash
   aws s3api put-bucket-policy \
     --bucket safeai-management-console-prod \
     --policy file://bucket-policy.json
   ```

5. **Upload Build Files to S3**
   ```bash
   aws s3 sync build/ s3://safeai-management-console-prod \
     --acl public-read \
     --delete
   ```

6. **Create CloudFront Distribution**
   ```bash
   aws cloudfront create-distribution \
     --origin-domain-name safeai-management-console-prod.s3.amazonaws.com \
     --default-root-object index.html
   ```

7. **Configure Custom Domain (Optional)**
   - Create SSL certificate in AWS Certificate Manager
   - Add alternate domain name to CloudFront distribution
   - Create Route 53 record pointing to CloudFront distribution

8. **Set up CI/CD Pipeline (Optional)**
   - Create CodePipeline connected to your repository
   - Configure build stage with npm commands
   - Add deployment stage targeting S3 bucket
   - Set up notifications for deployment events

### Security Best Practices

For production deployments, implement these security measures:
- Enable AWS WAF to protect against common web exploits
- Configure CloudFront with HTTPS only
- Implement proper CORS settings
- Use IAM roles with least privilege
- Enable CloudTrail for auditing
- Set up monitoring with CloudWatch
- Implement regular security scanning

## Connecting to safeAIcoin.com Blockchain

SafeAI features integration with its own blockchain at safeAIcoin.com. Follow these steps to connect:

### Configure RPC Connection

1. **Update Environment Configuration**
   Edit your `.env` file to include:
   ```
   # SafeAI Blockchain
   REACT_APP_SAFEAI_RPC_URL=https://rpc.safeaicoin.com
   REACT_APP_SAFEAI_CHAIN_ID=7331
   REACT_APP_SAFEAI_EXPLORER=https://explorer.safeaicoin.com
   ```

2. **Add Network to MetaMask**
   - Open MetaMask and click on the network dropdown
   - Select "Add Network"
   - Fill in the details:
     - Network Name: SafeAI Blockchain
     - RPC URL: https://rpc.safeaicoin.com
     - Chain ID: 7331
     - Currency Symbol: SAI
     - Block Explorer: https://explorer.safeaicoin.com

3. **Acquire SAI Tokens**
   - Visit the SafeAI faucet at https://faucet.safeaicoin.com
   - Request test tokens for development
   - For production use, acquire SAI through supported exchanges

### Deploy Contracts to SafeAI Blockchain

1. **Update Hardhat Configuration**
   Edit `hardhat.config.js` to add the SafeAI network:
   ```javascript
   networks: {
     // ... existing networks
     safeai: {
       url: process.env.REACT_APP_SAFEAI_RPC_URL || "https://rpc.safeaicoin.com",
       chainId: 7331,
       accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
     },
   }
   ```

2. **Create Deployment Script**
   ```bash
   npm run deploy:safeai
   ```
   This will deploy all contracts to the SafeAI blockchain

3. **Verify Contracts on Block Explorer**
   ```bash
   npx hardhat verify --network safeai CONTRACT_ADDRESS CONSTRUCTOR_ARGS
   ```

### Running Your Own Node

For advanced users who want to run a SafeAI blockchain node:

1. **Install Node Software**
   ```bash
   git clone https://github.com/FortressAI/safeai-node.git
   cd safeai-node
   ./install.sh
   ```

2. **Configure Node**
   ```bash
   cp config.example.toml config.toml
   # Edit config.toml with appropriate settings
   ```

3. **Start Node**
   ```bash
   ./start-node.sh
   ```

4. **Connect to Local Node**
   Update your `.env` file:
   ```
   REACT_APP_SAFEAI_RPC_URL=http://localhost:8545
   ```

## User Guides

### Dashboard

The Dashboard provides an overview of your SafeAI ecosystem:

![Dashboard Screenshot]()

**Key Features:**
- **System Health**: Monitor the status of connected services
- **Agent Statistics**: View active agents and their performance metrics
- **Recent Activity**: Track recent interactions with knowledge graphs
- **Security Status**: See current security posture and alerts
- **Network Status**: Check blockchain connection and status

**Usage:**
1. Connect your wallet using the "Connect" button if not already connected
2. Review system metrics and alerts
3. Access quick actions for common tasks
4. Navigate to detailed sections using the sidebar or quick links

### Ethics Knowledge Graph

The Ethics KG module provides tools for ethical evaluation and governance:

![Ethics KG Screenshot]()

**Key Features:**
- **Agent Auditing**: Evaluate agents against ethical frameworks
- **Ethical Principles**: Browse and manage ethical guidelines
- **Compliance Tracking**: Monitor agent compliance status
- **Ethical Labeling**: View and assign ethical labels to agents
- **Audit History**: Review previous ethical evaluations

**Usage:**
1. **Auditing an Agent**:
   - Navigate to the Ethics KG section
   - Select an agent from the list
   - Click "Audit Agent"
   - Review the comprehensive ethical analysis
   - Apply recommended labels if appropriate

2. **Managing Ethical Principles**:
   - Go to the "Principles" tab
   - Browse existing ethical frameworks
   - Add new principles with "Add Principle" button
   - Set weights and importance factors

3. **Viewing Audit History**:
   - Select an agent
   - Go to the "History" tab
   - Review previous audit results
   - Compare changes over time

### CyberSecurity Knowledge Graph

The CyberSecurity KG provides tools for security management:

![CyberSecurity KG Screenshot]()

**Key Features:**
- **Vulnerability Database**: Browse and search security vulnerabilities
- **Incident Tracking**: Record and analyze security incidents
- **CVE Integration**: Link to Common Vulnerabilities and Exposures
- **Remediation Guidance**: Get specific remediation steps
- **Agent Security Status**: Monitor agent security posture

**Usage:**
1. **Adding a Vulnerability**:
   - Navigate to the CyberSecurity KG section
   - Click "Add Vulnerability"
   - Fill in details including CVE ID if available
   - Add remediation steps
   - Submit to blockchain

2. **Recording a Security Incident**:
   - Go to the "Incidents" tab
   - Click "Add Incident"
   - Fill in incident details
   - Link to related vulnerabilities
   - Submit and track status

3. **Searching Vulnerabilities**:
   - Use the search bar to find specific issues
   - Filter by severity, date, or status
   - Export results for reporting

### Math Knowledge Graph

The Math KG module organizes mathematical knowledge:

![Math KG Screenshot]()

**Key Features:**
- **Concept Browser**: Explore mathematical concepts
- **Problem Repository**: Access and solve math problems
- **Proof Library**: Study mathematical proofs
- **Visualization Tools**: Visualize relationships between concepts
- **LaTeX Support**: Display mathematical notation

**Usage:**
1. **Exploring Math Concepts**:
   - Navigate to the Math KG section
   - Browse concepts by category
   - View prerequisites and related concepts
   - Examine formal definitions

2. **Adding a Math Problem**:
   - Go to the "Problems" tab
   - Click "Add Problem"
   - Enter title, description, and difficulty
   - Provide solution (with LaTeX if needed)
   - Link to related concepts
   - Submit to blockchain

3. **Studying Proofs**:
   - Select a concept or theorem
   - View associated proofs
   - Step through proof details
   - Examine related concepts

### FreePress Decentralized News

The FreePress module enables decentralized content publishing:

![FreePress Screenshot]()

**Key Features:**
- **Decentralized Publishing**: Publish content to IPFS and blockchain
- **Micropayments**: Monetize content with cryptocurrency
- **Content Licensing**: Control access to your publications
- **Author Verification**: Verify content authenticity
- **Decentralized Comments**: Engage with readers

**Usage:**
1. **Publishing an Article**:
   - Navigate to FreePress section
   - Click "New Article"
   - Enter title, content, and tags
   - Set price (if applicable)
   - Publish to IPFS and blockchain

2. **Reading Articles**:
   - Browse available articles
   - Purchase license if required (one-time payment)
   - Access content stored on IPFS
   - Verify authenticity on blockchain

3. **Managing Your Publications**:
   - Go to "My Publications"
   - View statistics and earnings
   - Update existing articles
   - Manage licensing

### Agent Workshop

The Agent Workshop allows creation and management of AI agents:

![Agent Workshop Screenshot]()

**Key Features:**
- **Agent Creation**: Build new AI agents
- **Performance Monitoring**: Track agent effectiveness
- **Capability Management**: Add and remove agent capabilities
- **Training Interface**: Improve agent performance
- **Agent Marketplace**: Share and discover agents

**Usage:**
1. **Creating a New Agent**:
   - Navigate to Agent Workshop
   - Click "Create Agent"
   - Provide name, description, and capabilities
   - Select knowledge graphs to connect
   - Deploy agent to blockchain

2. **Monitoring Performance**:
   - Select an agent from the list
   - View usage statistics
   - Check success and failure rates
   - Identify improvement opportunities

3. **Enhancing Capabilities**:
   - Go to "Capabilities" tab
   - Add new capabilities
   - Update existing functionality
   - Test performance changes

### Security Center

The Security Center ensures the integrity of your SafeAI ecosystem:

![Security Center Screenshot]()

**Key Features:**
- **Security Monitoring**: Track potential threats
- **Access Control**: Manage permissions
- **Audit Logs**: Review system activity
- **Compliance Checks**: Verify regulatory compliance
- **Incident Response**: Handle security events

**Usage:**
1. **Reviewing Security Status**:
   - Navigate to Security Center
   - View current security posture
   - Check for alerts or warnings
   - Run security validations

2. **Managing Access Control**:
   - Go to "Access" tab
   - Review current permissions
   - Modify access rights
   - Set up new roles

3. **Handling Security Incidents**:
   - Respond to alerts
   - Document incident details
   - Implement mitigation steps
   - Update security policies

### Settings

The Settings section configures your SafeAI environment:

![Settings Screenshot]()

**Key Features:**
- **API Configuration**: Manage API endpoints
- **Blockchain Settings**: Configure network connections
- **IPFS Configuration**: Set up decentralized storage
- **Theme Settings**: Customize interface appearance
- **Notification Preferences**: Control alerts and updates

**Usage:**
1. **Configuring API Endpoints**:
   - Navigate to Settings
   - Go to "API" tab
   - Enter endpoint URLs
   - Test connections

2. **Managing Blockchain Networks**:
   - Go to "Blockchain" tab
   - Add or edit network configurations
   - Set default network
   - Configure gas settings

3. **Setting Up IPFS**:
   - Go to "IPFS" tab
   - Configure gateway and API URLs
   - Set pinning services
   - Test IPFS connection

## Troubleshooting

### Connection Issues

**Problem**: Unable to connect to blockchain network
**Solution**:
1. Check MetaMask is installed and unlocked
2. Verify correct network is selected
3. Ensure RPC URL is correctly configured
4. Check for network outages

**Problem**: Contract interactions failing
**Solution**:
1. Verify you have sufficient gas (ETH/MATIC/SAI)
2. Check contract addresses in .env are correct
3. Ensure contract ABIs match deployed contracts
4. Look for error messages in browser console

### Development Issues

**Problem**: Smart contract compilation errors
**Solution**:
1. Check Solidity version compatibility
2. Verify import paths are correct
3. Look for syntax errors in contract code
4. Ensure dependencies are installed

**Problem**: Frontend not connecting to contracts
**Solution**:
1. Verify contract addresses in .env
2. Check if contracts are deployed to current network
3. Ensure ABI is correctly imported
4. Restart development server

### AWS Deployment Issues

**Problem**: S3 website not accessible
**Solution**:
1. Check bucket policy allows public access
2. Verify files were uploaded successfully
3. Ensure index document is configured
4. Check for CloudFront distribution errors

**Problem**: CI/CD pipeline failing
**Solution**:
1. Check build logs for errors
2. Verify IAM permissions
3. Ensure environment variables are set
4. Check for syntax errors in pipeline configuration

## Contributing

We welcome contributions to the SafeAI Management Console! Follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make changes and commit: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

Please follow the coding standards and include tests for new features.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

© 2024 FortressAI - SafeAI Management Console