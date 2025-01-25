import { expect } from "chai";
import { ethers } from "hardhat";
import { IPPSDistributor } from "../typechain-types";

describe("IPPSDistributor", function () {
  // We define a fixture to reuse the same setup in every test.

  let IPPSDistributor: IPPSDistributor;
  before(async () => {
    const [owner] = await ethers.getSigners();
    const IPPSDistributorFactory = await ethers.getContractFactory("IPPSDistributor");
    IPPSDistributor = (await IPPSDistributorFactory.deploy(owner.address)) as IPPSDistributor;
    await IPPSDistributor.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should show the rigth owner", async function () {
      expect(await IPPSDistributor.owner()).to.equal(owner);
    });

    it("Should allow setting a new message", async function () {
      const newGreeting = "Learn Scaffold-ETH 2! :)";

      // await IPPSDistributor.setGreeting(newGreeting);
      expect(await IPPSDistributor.owner()).to.equal(newGreeting);
    });
  });
});
