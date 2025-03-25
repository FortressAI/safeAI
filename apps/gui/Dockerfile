# Use Node.js Alpine for a smaller footprint
FROM node:18-alpine

WORKDIR /app

# Install system dependencies
RUN apk add --no-cache python3 make g++ git

# Copy package files first
COPY package*.json ./

# Clean npm cache and node_modules to ensure fresh installation
RUN npm cache clean --force
RUN rm -rf node_modules

# Install dependencies with specific versions and ensure proper resolution
RUN npm install --legacy-peer-deps

# Install specific versions of dependencies
RUN npm install --save-dev hardhat@2.19.3
RUN npm install --save @openzeppelin/contracts@4.9.3
RUN npm install --save-dev @nomicfoundation/hardhat-toolbox@4.0.0

# Debug: List all installed packages
RUN npm list @openzeppelin/contracts

# Copy the rest of the project files
COPY . .

# Create necessary directories
RUN mkdir -p src/artifacts/contracts

# Verify Hardhat configuration
RUN cat hardhat.config.js

# Compile contracts
RUN npx hardhat compile

# Build the React app
RUN npm run build

# Install serve for production
RUN npm install -g serve

# Copy the start script
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

# Expose ports for Hardhat node and React app
EXPOSE 8545 3001

# Start the node and app
CMD ["/app/start.sh"] 