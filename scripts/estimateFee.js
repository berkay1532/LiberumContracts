const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  // Kontratın adresini girin
  const contractAddress = "0x918f80Fc9aD946b27D989feD8c99A66d35584d41";

  // DomainNFT kontratını bağla
  const DomainNFT = await hre.ethers.getContractFactory("DomainNFT");
  const domainContract = DomainNFT.attach(contractAddress);

  // Mint edilecek domain adı
  const domainName = "beko.lib"; // <-- Domain name
  const duration = 300; // As second

  // *** Estimated Gas Fee Calculate ***
  const gasEstimate = await domainContract.mintDomain.estimateGas(
    domainName,
    duration
  );

  const feeData = await hre.ethers.provider.getFeeData();
  const estimatedGasFee = gasEstimate * feeData.gasPrice;

  console.log(
    `💰 Estimated Gas Fee: ${hre.ethers.formatEther(estimatedGasFee)} ETH`
  );
}

main().catch((error) => {
  console.error("❌ Error occured:", error);
  process.exitCode = 1;
});
