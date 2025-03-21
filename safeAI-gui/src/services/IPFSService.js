import { create } from 'ipfs-http-client';
import { Buffer } from 'buffer';

class IPFSService {
    constructor() {
        // Connect to Infura's IPFS gateway
        this.ipfs = create({
            host: 'ipfs.infura.io',
            port: 5001,
            protocol: 'https',
            headers: {
                authorization: 'Basic ' + Buffer.from(
                    process.env.REACT_APP_INFURA_PROJECT_ID + ':' + 
                    process.env.REACT_APP_INFURA_PROJECT_SECRET
                ).toString('base64')
            }
        });
    }

    async uploadContent(content) {
        try {
            // Prepare metadata
            const metadata = {
                content,
                timestamp: Date.now(),
                version: '1.0'
            };

            // Convert content to Buffer
            const contentBuffer = Buffer.from(JSON.stringify(metadata));

            // Upload to IPFS
            const result = await this.ipfs.add(contentBuffer);
            
            // Return the IPFS hash (CID)
            return {
                cid: result.path,
                size: result.size,
                metadata
            };
        } catch (error) {
            console.error('Error uploading to IPFS:', error);
            throw error;
        }
    }

    async uploadFile(file) {
        try {
            // Create a buffer from the file
            const buffer = await file.arrayBuffer();
            const path = await this.ipfs.add(buffer);

            return {
                cid: path.cid.toString(),
                size: path.size
            };
        } catch (error) {
            console.error('Error uploading file to IPFS:', error);
            throw error;
        }
    }

    async getContent(cid) {
        try {
            let content = '';
            
            // Stream the data from IPFS
            for await (const chunk of this.ipfs.cat(cid)) {
                content += new TextDecoder().decode(chunk);
            }

            // Parse the JSON content
            return JSON.parse(content);
        } catch (error) {
            console.error('Error fetching from IPFS:', error);
            throw error;
        }
    }

    // Get the IPFS gateway URL for a given CID
    getIPFSUrl(cid) {
        return `https://ipfs.io/ipfs/${cid}`;
    }

    // Pin content to ensure it stays available
    async pinContent(cid) {
        try {
            await this.ipfs.pin.add(cid);
            return true;
        } catch (error) {
            console.error('Error pinning content:', error);
            throw error;
        }
    }

    // Unpin content when no longer needed
    async unpinContent(cid) {
        try {
            await this.ipfs.pin.rm(cid);
            return true;
        } catch (error) {
            console.error('Error unpinning content:', error);
            throw error;
        }
    }

    // Get all pinned content
    async getPinnedContent() {
        try {
            const pins = [];
            for await (const pin of this.ipfs.pin.ls()) {
                pins.push(pin);
            }
            return pins;
        } catch (error) {
            console.error('Error getting pinned content:', error);
            throw error;
        }
    }
}

export default new IPFSService(); 