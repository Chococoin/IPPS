import { ethers } from "hardhat";
import { expect } from "chai";

describe("IPPSDistributor", function () {
  let IPPSDistributor: any;
  let contract: any;
  let owner: any;
  let addr1: any;
  let addr2: any;
  let addr3: any;
  let addr4: any;
  let addr5: any;
  let addr6: any;
  let addr7: any;
  let addr8: any;
  let addr9: any;
  let addr10: any;
  let addr11: any;
  let addr12: any;
  let addr13: any;
  let addr14: any;

  before(async function () {
    IPPSDistributor = await ethers.getContractFactory("IPPSDistributor");
    [owner, addr1, addr2, addr3, addr4, addr5, addr6, addr7, addr8, addr9, addr10, addr11, addr12, addr13, addr14] = await ethers.getSigners();

    const signers = await ethers.getSigners();
    console.log("Number of signers available:", signers.length);

    signers.forEach((signer, index) => {
      console.log(`Signer ${index + 1}: ${signer.address}`);
    });

    // Deploy contract with owner depositing 1 ether
    contract = await IPPSDistributor.deploy({ value: ethers.parseEther("1") });
    console.log("Contract deployed at:", contract.target);
  });

  it("Should deploy the contract and set the owner as the initial docker", async function () {
    const docker = await contract.docker();
    expect(docker).to.equal(owner.address);
  });

  it("Should correctly show the balance", async function () {
    const contractBalance1 = await contract.getBalance();
    expect(contractBalance1).to.equal(ethers.parseEther("1"));
  })

  it("Should allow a new user to deposit and become a bridge", async function () {
    await addr1.sendTransaction({
      to: contract.target,
      value: ethers.parseEther("1"),
    });
  
    const bridges = await contract.bridges(0);
    expect(bridges).to.equal(addr1.address);
  });

  it("Should correctly show the balance 2", async function () {
    const contractBalance2 = await contract.getBalance();
    expect(contractBalance2).to.equal(ethers.parseEther("2"));
  })

  it("Should correctly promote the second bridge to docker 1", async function () {
    // Simulate deposits for 4 bridges
    await addr2.sendTransaction({ to: contract.target, value: ethers.parseEther("1") });
    await addr3.sendTransaction({ to: contract.target, value: ethers.parseEther("1") });
    await addr4.sendTransaction({ to: contract.target, value: ethers.parseEther("1") });

    // Check the new docker
    const newDocker = await contract.docker();
    expect(newDocker).to.equal(addr1.address);
  });

  it("Should correctly show the balance 3", async function () {
    const contractBalance3 = await contract.getBalance();
    expect(contractBalance3).to.equal(ethers.parseEther("5"));
  })

  it("Should correctly promote the second bridge to docker 2", async function () {
    // Simulate more deposits
    await addr5.sendTransaction({ to: contract.target, value: ethers.parseEther("1") });
    await addr6.sendTransaction({ to: contract.target, value: ethers.parseEther("1") });

    // const contractBalance4 = await contract.getBalance();
    // expect(contractBalance4).to.equal(ethers.parseEther("7"));

    await addr7.sendTransaction({ to: contract.target, value: ethers.parseEther("1") });

    // const contractBalance5 = await contract.getBalance();
    // expect(contractBalance5).to.equal(ethers.parseEther("8"));

    await addr8.sendTransaction({ to: contract.target, value: ethers.parseEther("1") });
  
    // Check the second bridge is now docker
    const secondDocker = await contract.docker();
    expect(secondDocker).to.equal(addr2.address);
  });

  it("Should correctly promote the second bridge to docker 3", async function () {
    // Simulate more deposits
    await addr9.sendTransaction({ to: contract.target, value: ethers.parseEther("1") });
    await addr10.sendTransaction({ to: contract.target, value: ethers.parseEther("1") });
    await addr11.sendTransaction({ to: contract.target, value: ethers.parseEther("1") });
    await addr12.sendTransaction({ to: contract.target, value: ethers.parseEther("1") });
  
    // Check the second bridge is now docker
    const thirdDocker = await contract.docker();
    expect(thirdDocker).to.equal(addr3.address);
  });

  // it("Should correctly assign bridges to participants", async function () {
    // await addr13.sendTransaction({ to: contract.target, value: ethers.parseEther("1") });
    // await addr14.sendTransaction({ to: contract.target, value: ethers.parseEther("1") });
  
    // Verify bridger relationships
    // expect(await contract.bridgers(addr2.address)).to.equal(addr1.address); // addr1 is the bridger for addr2
    // expect(await contract.bridgers(addr3.address)).to.equal(addr1.address); // addr1 is the bridger for addr3
    // expect(await contract.bridgers(addr4.address)).to.equal(addr1.address); // addr1 is the bridger for addr4
    // expect(await contract.bridgers(addr5.address)).to.equal(addr1.address); // addr1 is the bridger for addr5
  
    // expect(await contract.bridgers(addr6.address)).to.equal(addr2.address); // addr2 is the bridger for addr6
    // expect(await contract.bridgers(addr7.address)).to.equal(addr2.address); // addr2 is the bridger for addr7
    // expect(await contract.bridgers(addr8.address)).to.equal(addr2.address); // addr2 is the bridger for addr8
    // expect(await contract.bridgers(addr9.address)).to.equal(addr2.address); // addr2 is the bridger for addr9
  
    // expect(await contract.bridgers(addr10.address)).to.equal(addr3.address); // addr3 is the bridger for addr10
    // expect(await contract.bridgers(addr11.address)).to.equal(addr3.address); // addr3 is the bridger for addr11
    // expect(await contract.bridgers(addr12.address)).to.equal(addr3.address); // addr3 is the bridger for addr12
    // expect(await contract.bridgers(addr13.address)).to.equal(addr3.address); // addr3 is the bridger for addr13
  // });
  

});
