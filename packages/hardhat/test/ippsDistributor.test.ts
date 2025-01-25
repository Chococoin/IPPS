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
  let addr15: any;
  let addr16: any;
  let addr17: any;
  let addr18: any;
  let addr19: any;
  let addr20: any;
  let addr21: any;
  let addr22: any;
  let addr23: any;
  let addr24: any;

  before(async function () {
    IPPSDistributor = await ethers.getContractFactory("IPPSDistributor");
    [owner, addr1, addr2, addr3, addr4, addr5, addr6, addr7, addr8, addr9, addr10, addr11, addr12, addr13, addr14, addr15, addr16, addr17, addr18, addr19, addr20, addr21, addr22, addr23, addr24] = await ethers.getSigners();

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

  it("Should correctly assign bridges (owner) to participants", async function () {
    expect(await contract.bridgers(addr1.address)).to.equal(owner.address);
    expect(await contract.bridgers(addr2.address)).to.equal(owner.address);
    expect(await contract.bridgers(addr3.address)).to.equal(owner.address);
    expect(await contract.bridgers(addr4.address)).to.equal(owner.address);
  });

  it("Should correctly show the balance 3", async function () {
    const contractBalance3 = await contract.getBalance();
    expect(contractBalance3).to.equal(ethers.parseEther("5"));
  })

  it("Should correctly promote the second bridge to docker 2", async function () {
    // Simulate more deposits
    await addr5.sendTransaction({ to: contract.target, value: ethers.parseEther("1") });
    await addr6.sendTransaction({ to: contract.target, value: ethers.parseEther("1") });

    const contractBalance4 = await contract.getBalance();
    expect(contractBalance4).to.equal(ethers.parseEther("7"));

    await addr7.sendTransaction({ to: contract.target, value: ethers.parseEther("1") });
    await addr8.sendTransaction({ to: contract.target, value: ethers.parseEther("1") });
  
    // Check the second bridge is now docker
    const secondDocker = await contract.docker();
    expect(secondDocker).to.equal(addr2.address);
  });

  it("Should correctly assign bridges (addrs1) to participants", async function () {
    expect(await contract.bridgers(addr5.address)).to.equal(addr1.address);
    expect(await contract.bridgers(addr6.address)).to.equal(addr1.address);
    expect(await contract.bridgers(addr7.address)).to.equal(addr1.address);
    expect(await contract.bridgers(addr8.address)).to.equal(addr1.address);
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

  it("Should correctly assign bridges (addrs2) to participants", async function () {
    expect(await contract.bridgers(addr9.address)).to.equal(addr2.address);
    expect(await contract.bridgers(addr10.address)).to.equal(addr2.address);
    expect(await contract.bridgers(addr11.address)).to.equal(addr2.address);
    expect(await contract.bridgers(addr12.address)).to.equal(addr2.address);
  });

  it("Should correctly assign bridges (addrs3) to participants", async function () {
    await addr13.sendTransaction({ to: contract.target, value: ethers.parseEther("1") });
    await addr14.sendTransaction({ to: contract.target, value: ethers.parseEther("1") });
    await addr15.sendTransaction({ to: contract.target, value: ethers.parseEther("1") });
    await addr16.sendTransaction({ to: contract.target, value: ethers.parseEther("1") });
  
    // Verify bridger relationships
    expect(await contract.bridgers(addr13.address)).to.equal(addr3.address);
    expect(await contract.bridgers(addr14.address)).to.equal(addr3.address);
    expect(await contract.bridgers(addr15.address)).to.equal(addr3.address);
    expect(await contract.bridgers(addr16.address)).to.equal(addr3.address);
  });

  it("Should correctly assign bridges (addrs4) to participants", async function () {
    await addr17.sendTransaction({ to: contract.target, value: ethers.parseEther("1") });
    await addr18.sendTransaction({ to: contract.target, value: ethers.parseEther("1") });
    await addr19.sendTransaction({ to: contract.target, value: ethers.parseEther("1") });
    await addr20.sendTransaction({ to: contract.target, value: ethers.parseEther("1") });
  
    // Verify bridger relationships
    expect(await contract.bridgers(addr17.address)).to.equal(addr4.address);
    expect(await contract.bridgers(addr18.address)).to.equal(addr4.address);
    expect(await contract.bridgers(addr19.address)).to.equal(addr4.address);
    expect(await contract.bridgers(addr20.address)).to.equal(addr4.address);
  });

  it("Should correctly assign bridges (addrs5) to participants", async function () {
    await addr21.sendTransaction({ to: contract.target, value: ethers.parseEther("1") });
    await addr22.sendTransaction({ to: contract.target, value: ethers.parseEther("1") });
    await addr23.sendTransaction({ to: contract.target, value: ethers.parseEther("1") });
    await addr24.sendTransaction({ to: contract.target, value: ethers.parseEther("1") });
  
    // Verify bridger relationships
    expect(await contract.bridgers(addr21.address)).to.equal(addr5.address);
    expect(await contract.bridgers(addr22.address)).to.equal(addr5.address);
    expect(await contract.bridgers(addr23.address)).to.equal(addr5.address);
    expect(await contract.bridgers(addr24.address)).to.equal(addr5.address);
  });

  

  // it("Should handle a large number of deposits and print balances", async function () {
  //   const signers = await ethers.getSigners();
  
  //   // Define the number of deposits you want to simulate
  //   const numDeposits = 1984; // Adjust this number based on your needs
  //   console.log(`Simulating ${numDeposits} deposits...`);
  
  //   for (let i = 16; i <= numDeposits; i++) {
  //     const signer = signers[i % signers.length]; // Cycle through the available signers
  //     await signer.sendTransaction({
  //       to: contract.target,
  //       value: ethers.parseEther("1"), // Each signer sends 1 Ether
  //     });
  //     console.log(`Signer ${i % signers.length + 1} (${signer.address}) sent 1 Ether`);
  //   }
  
  //   // Print balances for the Owner and the first 16 accounts
  //   const accountsToCheck = [owner, ...signers.slice(0, 16)];
  //   for (let i = 1; i < accountsToCheck.length; i++) {
  //     const balance = await ethers.provider.getBalance(accountsToCheck[i].address);
  //     console.log(`Account ${i}: ${accountsToCheck[i].address}, Balance: ${ethers.formatEther(balance)} ETH`);
  //   }
  
  //   // Verify contract balance after all deposits
  //   const contractBalance = await contract.getBalance();
  //   console.log(`Contract balance after ${numDeposits} deposits:`, ethers.formatEther(contractBalance));
  
  //   // Optionally, verify the size of pub or bridges
  //   const pubSize = await contract.getPubSize();
  //   console.log(`Size of pub after ${numDeposits} deposits: ${pubSize}`);
  // });

  // it("Should handle deposits and check balances after each deposit", async function () {
  //   const signers = await ethers.getSigners();
  
  //   // Define the number of deposits you want to simulate
  //   const numDeposits = 1984; // Adjust this number based on your needs
  //   console.log(`Simulating ${numDeposits} deposits...`);
  
  //   // Define the accounts to monitor (Owner and the first 16 signers)
  //   const accountsToCheck = [owner, ...signers.slice(0, 16)];
  
  //   for (let i = 16; i <= numDeposits; i++) {
  //     const signer = signers[i % signers.length]; // Cycle through the available signers
  
  //     // Perform the deposit
  //     await signer.sendTransaction({
  //       to: contract.target,
  //       value: ethers.parseEther("1"), // Each signer sends 1 Ether
  //     });
  //     console.log(`Signer ${i % signers.length + 1} (${signer.address}) sent 1 Ether`);
  
  //     // Check balances of monitored accounts after the deposit
  //     console.log(`Balances after deposit ${i}:`);
  //     for (let j = 1; j < accountsToCheck.length; j++) {
  //       const balance = await ethers.provider.getBalance(accountsToCheck[j].address);
  //       console.log(`Account ${j}: ${accountsToCheck[j].address}, Balance: ${ethers.formatEther(balance)} ETH`);
  //     }
  //   }
  
  //   // Verify contract balance after all deposits
  //   const contractBalance = await contract.getBalance();
  //   console.log(`Contract balance after ${numDeposits} deposits:`, ethers.formatEther(contractBalance));
  
  //   // Optionally, verify the size of pub or bridges
  //   const pubSize = await contract.getPubSize();
  //   console.log(`Size of pub after ${numDeposits} deposits: ${pubSize}`);
  // });
});
