# Compile contracts
RUN npx hardhat compile

# Build the React app
ENV ESLINT_NO_DEV_ERRORS=true
ENV ESLINT_NO_DEV_WARNINGS=true
ENV DISABLE_ESLINT_PLUGIN=true
RUN npm run build

# Install serve for production 