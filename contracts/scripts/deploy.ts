import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const feeWei = "1000000000000000"; // 0.001 ether
  const SafeAIBilling = await ethers.getContractFactory("SafeAIBilling");
  const contract = await SafeAIBilling.deploy(feeWei);
  await contract.deployed();

  console.log("SafeAIBilling deployed to:", contract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
