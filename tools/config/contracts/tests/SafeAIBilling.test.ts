import { ethers } from "hardhat";
import { expect } from "chai";
import { Contract } from "ethers";

describe("SafeAIBilling", function () {
  let safeAIBilling: Contract;
  let owner: any;
  let addr1: any;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    const SafeAIBilling = await ethers.getContractFactory("SafeAIBilling");
    // Deploy contract with a fee of 0.001 ETH (in wei)
    safeAIBilling = await SafeAIBilling.deploy("1000000000000000");
    await safeAIBilling.deployed();
  });

  it("Should set owner correctly", async function () {
    expect(await safeAIBilling.owner()).to.equal(owner.address);
  });

  it("Should allow deposits", async function () {
    await safeAIBilling.connect(addr1).deposit({ value: "2000000000000000" });
    const balance = await safeAIBilling.balances(addr1.address);
    expect(balance.toString()).to.equal("2000000000000000");
  });

  it("Should charge for query correctly", async function () {
    await safeAIBilling.connect(addr1).deposit({ value: "2000000000000000" });
    await safeAIBilling.connect(owner).chargeForQuery(addr1.address);
    const newBalance = await safeAIBilling.balances(addr1.address);
    expect(newBalance.toString()).to.equal("1000000000000000");
  });

  it("Should revert if insufficient balance for charge", async function () {
    await safeAIBilling.connect(addr1).deposit({ value: "500000000000000" });
    await expect(
      safeAIBilling.connect(owner).chargeForQuery(addr1.address)
    ).to.be.revertedWith("Insufficient balance");
  });
});
