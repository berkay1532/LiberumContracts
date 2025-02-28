const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  // DomainNFT contract address
  const contractAddress = "0x918f80Fc9aD946b27D989feD8c99A66d35584d41";

  const DomainNFT = await hre.ethers.getContractFactory("DomainNFT");
  const domainContract = DomainNFT.attach(contractAddress);

  const domainName = "xyz.lib";

  console.log(`🛠️ Minting process is starting: ${domainName}...`);

  const tx = await domainContract.mintDomain(domainName, 30000000);
  const receipt = await tx.wait();

  console.log(`✅ Domain minted successfully: ${domainName}`);
  console.log(`🔗 Tx Hash: ${receipt.transactionHash}`);
}

main().catch((error) => {
  console.error("❌ Error occured:", error);
  process.exitCode = 1;
});
