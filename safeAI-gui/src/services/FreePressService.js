import Web3 from 'web3';
import IPFSService from './IPFSService';

class FreePressService {
    constructor() {
        this.web3 = null;
        this.contract = null;
        this.account = null;
    }

    async initialize() {
        if (typeof window.ethereum !== 'undefined') {
            try {
                // Request account access
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                this.web3 = new Web3(window.ethereum);
                
                // Get the contract address from environment variables
                const contractAddress = process.env.REACT_APP_FREEPRESS_CONTRACT_ADDRESS;
                
                // Import contract ABI from artifacts
                // This will be available after running 'npm run compile'
                const contractABI = require('../artifacts/contracts/FreePressContract.sol/FreePressContract.json').abi;
                
                // Create contract instance
                this.contract = new this.web3.eth.Contract(
                    contractABI,
                    contractAddress
                );
                
                // Get the active account
                const accounts = await this.web3.eth.getAccounts();
                this.account = accounts[0];
                
                // Listen for account changes
                window.ethereum.on('accountsChanged', (accounts) => {
                    this.account = accounts[0];
                });
                
                return true;
            } catch (error) {
                console.error('Error initializing Web3:', error);
                throw error;
            }
        } else {
            console.error('Web3 not found. Please install MetaMask.');
            throw new Error('Web3 not found. Please install MetaMask.');
        }
    }

    async registerPublisher(name) {
        try {
            await this.contract.methods.registerPublisher(name)
                .send({ from: this.account });
            return true;
        } catch (error) {
            console.error('Error registering publisher:', error);
            throw error;
        }
    }

    async publishArticle(content, price, title, tags) {
        try {
            // Upload content to IPFS
            const ipfsResult = await IPFSService.uploadContent({
                content,
                title,
                tags,
                timestamp: Date.now()
            });

            // Convert price to Wei
            const priceInWei = this.web3.utils.toWei(price.toString(), 'ether');

            // Publish article on blockchain
            const result = await this.contract.methods
                .publishArticle(ipfsResult.cid, priceInWei, title, tags)
                .send({ from: this.account });

            return {
                articleId: result.events.ArticlePublished.returnValues.articleId,
                ipfsHash: ipfsResult.cid,
                transaction: result
            };
        } catch (error) {
            console.error('Error publishing article:', error);
            throw error;
        }
    }

    async purchaseLicense(articleId) {
        try {
            const article = await this.contract.methods.articles(articleId).call();
            
            const result = await this.contract.methods.purchaseLicense(articleId)
                .send({ 
                    from: this.account,
                    value: article.price
                });

            return {
                success: true,
                transaction: result
            };
        } catch (error) {
            console.error('Error purchasing license:', error);
            throw error;
        }
    }

    async getArticle(articleId) {
        try {
            const article = await this.contract.methods.articles(articleId).call();
            
            // Get content from IPFS
            const content = await IPFSService.getContent(article.ipfsHash);
            
            return {
                ...article,
                content
            };
        } catch (error) {
            console.error('Error getting article:', error);
            throw error;
        }
    }

    async getPublisherArticles(publisherAddress) {
        try {
            const articleIds = await this.contract.methods
                .getPublisherArticles(publisherAddress)
                .call();

            const articles = await Promise.all(
                articleIds.map(id => this.getArticle(id))
            );

            return articles;
        } catch (error) {
            console.error('Error getting publisher articles:', error);
            throw error;
        }
    }

    async getUserLicenses(userAddress) {
        try {
            const articleIds = await this.contract.methods
                .getUserLicenses(userAddress)
                .call();

            const articles = await Promise.all(
                articleIds.map(id => this.getArticle(id))
            );

            return articles;
        } catch (error) {
            console.error('Error getting user licenses:', error);
            throw error;
        }
    }

    async updateArticle(articleId, newContent) {
        try {
            // Upload new content to IPFS
            const ipfsResult = await IPFSService.uploadContent(newContent);

            // Update article on blockchain
            const result = await this.contract.methods
                .updateArticle(articleId, ipfsResult.cid)
                .send({ from: this.account });

            return {
                success: true,
                ipfsHash: ipfsResult.cid,
                transaction: result
            };
        } catch (error) {
            console.error('Error updating article:', error);
            throw error;
        }
    }

    async getPublisherInfo(publisherAddress) {
        try {
            const publisher = await this.contract.methods
                .publishers(publisherAddress)
                .call();

            return publisher;
        } catch (error) {
            console.error('Error getting publisher info:', error);
            throw error;
        }
    }

    // Helper method to convert Wei to Ether
    weiToEther(wei) {
        return this.web3.utils.fromWei(wei, 'ether');
    }

    // Helper method to convert Ether to Wei
    etherToWei(ether) {
        return this.web3.utils.toWei(ether.toString(), 'ether');
    }
}

export default new FreePressService(); 