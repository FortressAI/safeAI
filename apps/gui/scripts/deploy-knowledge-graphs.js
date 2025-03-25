const { ethers } = require("hardhat");

async function main() {
  const hre = require("hardhat");
  
  console.log("Deploying Knowledge Graph contracts...");

  // Deploy CyberSecurity KG
  console.log("\nDeploying CyberSecurityKG contract...");
  const cyberDescription = "Comprehensive Cybersecurity Knowledge Graph for threat analysis, vulnerability management, and security incident tracking.";
  const CyberSecurityKG = await ethers.getContractFactory("CyberSecurityKG");
  const cyberSecurityKG = await CyberSecurityKG.deploy(cyberDescription);
  await cyberSecurityKG.waitForDeployment();
  const cyberSecurityKGAddress = await cyberSecurityKG.getAddress();
  console.log("CyberSecurityKG deployed to:", cyberSecurityKGAddress);
  console.log("Add this to your .env file: REACT_APP_CYBERSECURITY_KG_CONTRACT_ADDRESS=" + cyberSecurityKGAddress);

  // Deploy Math KG
  console.log("\nDeploying MathKG contract...");
  const mathDescription = "Mathematical Knowledge Graph for representing mathematical concepts, problems, and proofs across various domains.";
  const MathKG = await ethers.getContractFactory("MathKG");
  const mathKG = await MathKG.deploy(mathDescription);
  await mathKG.waitForDeployment();
  const mathKGAddress = await mathKG.getAddress();
  console.log("MathKG deployed to:", mathKGAddress);
  console.log("Add this to your .env file: REACT_APP_MATH_KG_CONTRACT_ADDRESS=" + mathKGAddress);

  // Deploy FreePress contract
  console.log("\nDeploying FreePressContract...");
  const FreePressContract = await ethers.getContractFactory("FreePressContract");
  const freePressContract = await FreePressContract.deploy();
  await freePressContract.waitForDeployment();
  const freePressContractAddress = await freePressContract.getAddress();
  console.log("FreePressContract deployed to:", freePressContractAddress);
  console.log("Add this to your .env file: REACT_APP_FREEPRESS_CONTRACT_ADDRESS=" + freePressContractAddress);

  // Verify on etherscan if not on a local network
  const networkName = hre.network.name;
  if (networkName !== "hardhat" && networkName !== "localhost") {
    console.log("\nWaiting for block confirmations...");
    
    // Wait for block confirmations
    await cyberSecurityKG.deploymentTransaction().wait(5);
    await mathKG.deploymentTransaction().wait(5);
    await freePressContract.deploymentTransaction().wait(5);

    // Verify CyberSecurityKG
    console.log("Verifying CyberSecurityKG on Etherscan...");
    await hre.run("verify:verify", {
      address: cyberSecurityKGAddress,
      constructorArguments: [cyberDescription],
    });

    // Verify MathKG
    console.log("Verifying MathKG on Etherscan...");
    await hre.run("verify:verify", {
      address: mathKGAddress,
      constructorArguments: [mathDescription],
    });

    // Verify FreePressContract
    console.log("Verifying FreePressContract on Etherscan...");
    await hre.run("verify:verify", {
      address: freePressContractAddress,
      constructorArguments: [],
    });

    console.log("All contracts verified on Etherscan");
  }

  console.log("\nDeployment complete!");
  console.log("Contract addresses:");
  console.log("CyberSecurityKG:", cyberSecurityKGAddress);
  console.log("MathKG:", mathKGAddress);
  console.log("FreePressContract:", freePressContractAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 