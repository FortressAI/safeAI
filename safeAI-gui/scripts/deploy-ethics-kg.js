const { ethers } = require("hardhat");

async function main() {
  const hre = require("hardhat");
  console.log("Deploying EthicsKG contract...");

  // Deploy the contract
  const description = "Adaptive Ethics and Moral Reasoning Knowledge Graph that provides dynamic ethical guidance through multiple ethical frameworks.";
  const EthicsKG = await ethers.getContractFactory("EthicsKG");
  const ethicsKG = await EthicsKG.deploy();

  await ethicsKG.waitForDeployment();
  
  const ethicsKGAddress = await ethicsKG.getAddress();
  console.log("EthicsKG deployed to:", ethicsKGAddress);

  // For frontend configuration
  console.log("Add this contract address to your .env file: REACT_APP_ETHICS_KG_CONTRACT_ADDRESS=" + ethicsKGAddress);

  // Verify on etherscan if not on a local network
  const networkName = hre.network.name;
  if (networkName !== "hardhat" && networkName !== "localhost") {
    console.log("Waiting for block confirmations...");
    await ethicsKG.deploymentTransaction().wait(5);

    console.log("Verifying contract on Etherscan...");
    await hre.run("verify:verify", {
      address: ethicsKGAddress,
      constructorArguments: [],
    });
    console.log("Contract verified on Etherscan");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 