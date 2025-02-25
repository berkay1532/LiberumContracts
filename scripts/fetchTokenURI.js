const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  // Kontratın adresini girin
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // <-- Buraya kendi kontrat adresinizi koyun

  // DomainNFT kontratını bağla
  const DomainNFT = await hre.ethers.getContractFactory("DomainNFT");
  const domainContract = DomainNFT.attach(contractAddress);

  // Mint edilecek domain adı
  const tokenId = 0; // <-- Buraya istediğiniz domain adını koyun

  console.log(`🛠️ Fetch URI işlemi başlatılıyor: ${tokenId}...`);

  // Token URI fetch işlemini başlat
  const tokenURI = await domainContract.tokenURI(tokenId);
  console.log(tokenURI);

  console.log(`✅ Token uri başarıyla fetch edildi: ${tokenId}`);
}

// Hata yakalama mekanizması
main().catch((error) => {
  console.error("❌ Hata oluştu:", error);
  process.exitCode = 1;
});
