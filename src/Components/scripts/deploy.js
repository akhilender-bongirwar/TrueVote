const { ethers } = require("hardhat");


//Deploying the contract on the Polygon network
async function main() {
  const Transaction = await ethers.getContractFactory("VotingForPurpose");
  const contract = await Transaction.deploy();
  console.log(contract.address);
}

//Exporting the deployed contract
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});