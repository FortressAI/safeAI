// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract FreePressContract is ERC721, ReentrancyGuard, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    
    struct Article {
        string ipfsHash;          // IPFS content hash
        address publisher;
        uint256 price;
        uint256 timestamp;
        bool isActive;
        string title;
        string[] tags;
    }
    
    struct Publisher {
        string name;
        uint256 reputation;
        bool isRegistered;
        uint256 totalEarnings;
    }
    
    struct License {
        uint256 articleId;
        address licensee;
        uint256 timestamp;
        bool isActive;
    }
    
    mapping(uint256 => Article) public articles;
    mapping(address => Publisher) public publishers;
    mapping(uint256 => mapping(address => License)) public licenses;
    mapping(address => uint256[]) public publisherArticles;
    mapping(address => uint256[]) public userLicenses;
    
    uint256 public platformFee = 5; // 5% platform fee
    
    event PublisherRegistered(address indexed publisher, string name);
    event ArticlePublished(uint256 indexed articleId, address indexed publisher, string ipfsHash);
    event LicensePurchased(uint256 indexed articleId, address indexed licensee);
    event ArticleUpdated(uint256 indexed articleId, string newIpfsHash);
    event ReputationUpdated(address indexed publisher, uint256 newReputation);
    
    constructor() ERC721("FreePress", "NEWS") Ownable() {}
    
    modifier onlyPublisher() {
        require(publishers[msg.sender].isRegistered, "Only registered publishers can call this function");
        _;
    }
    
    function registerPublisher(string memory name) external {
        require(!publishers[msg.sender].isRegistered, "Publisher already registered");
        publishers[msg.sender] = Publisher(name, 0, true, 0);
        emit PublisherRegistered(msg.sender, name);
    }
    
    function publishArticle(
        string memory ipfsHash,
        uint256 price,
        string memory title,
        string[] memory tags
    ) external onlyPublisher returns (uint256) {
        _tokenIds.increment();
        uint256 newArticleId = _tokenIds.current();
        
        articles[newArticleId] = Article(
            ipfsHash,
            msg.sender,
            price,
            block.timestamp,
            true,
            title,
            tags
        );
        
        publisherArticles[msg.sender].push(newArticleId);
        _safeMint(msg.sender, newArticleId);
        
        emit ArticlePublished(newArticleId, msg.sender, ipfsHash);
        return newArticleId;
    }
    
    function purchaseLicense(uint256 articleId) external payable nonReentrant {
        Article storage article = articles[articleId];
        require(article.isActive, "Article is not active");
        require(msg.value >= article.price, "Insufficient payment");
        require(!licenses[articleId][msg.sender].isActive, "License already purchased");
        
        uint256 platformAmount = (msg.value * platformFee) / 100;
        uint256 publisherAmount = msg.value - platformAmount;
        
        // Transfer platform fee
        payable(owner()).transfer(platformAmount);
        
        // Transfer remaining amount to publisher
        payable(article.publisher).transfer(publisherAmount);
        
        // Update publisher earnings
        publishers[article.publisher].totalEarnings += publisherAmount;
        
        // Create license
        licenses[articleId][msg.sender] = License(
            articleId,
            msg.sender,
            block.timestamp,
            true
        );
        
        userLicenses[msg.sender].push(articleId);
        
        emit LicensePurchased(articleId, msg.sender);
    }
    
    function updateArticle(uint256 articleId, string memory newIpfsHash) external {
        require(msg.sender == articles[articleId].publisher, "Only article publisher can update");
        articles[articleId].ipfsHash = newIpfsHash;
        emit ArticleUpdated(articleId, newIpfsHash);
    }
    
    function updateReputation(address publisher, uint256 newReputation) external onlyOwner {
        require(publishers[publisher].isRegistered, "Publisher not registered");
        publishers[publisher].reputation = newReputation;
        emit ReputationUpdated(publisher, newReputation);
    }
    
    function getPublisherArticles(address publisher) external view returns (uint256[] memory) {
        return publisherArticles[publisher];
    }
    
    function getUserLicenses(address user) external view returns (uint256[] memory) {
        return userLicenses[user];
    }
    
    function setPlatformFee(uint256 newFee) external onlyOwner {
        require(newFee <= 20, "Platform fee cannot exceed 20%");
        platformFee = newFee;
    }
    
    function withdrawPlatformFees() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
} 