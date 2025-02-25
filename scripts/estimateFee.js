const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  // Kontratın adresini girin
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // <-- Kontrat adresiniz

  // DomainNFT kontratını bağla
  const DomainNFT = await hre.ethers.getContractFactory("DomainNFT");
  const domainContract = DomainNFT.attach(contractAddress);

  // Mint edilecek domain adı
  const domainName = "beko.lib"; // <-- Buraya istediğiniz domain adını koyun
  const duration = 300; // Süreyi (örneğin saniye cinsinden) belirleyin

  // *** ESTIMATED GAS FEE HESAPLAMA ***
  const gasEstimate = await domainContract.mintDomain.estimateGas(
    domainName,
    duration
  );

  const feeData = await hre.ethers.provider.getFeeData();
  const estimatedGasFee = gasEstimate * feeData.gasPrice;

  console.log(
    `💰 Tahmini Gas Ücreti: ${hre.ethers.formatEther(estimatedGasFee)} ETH`
  );
}

// Hata yakalama mekanizması
main().catch((error) => {
  console.error("❌ Hata oluştu:", error);
  process.exitCode = 1;
});
