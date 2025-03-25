#!/bin/sh
npx hardhat node &
sleep 5
npx hardhat run scripts/deploy-knowledge-graphs.js --network localhost
npx hardhat run scripts/deploy-ethics-kg.js --network localhost
serve -s build -l 3001 