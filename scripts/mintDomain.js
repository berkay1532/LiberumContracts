const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  // Kontratın adresini girin
  const contractAddress = "0xCe5FFC86bbF58409AC380E11c5A4170Fd3b3C6Db"; // <-- Buraya kendi kontrat adresinizi koyun

  // DomainNFT kontratını bağla
  const DomainNFT = await hre.ethers.getContractFactory("DomainNFT");
  const domainContract = DomainNFT.attach(contractAddress);

  // Mint edilecek domain adı
  const domainName = "xyz.lib"; // <-- Buraya istediğiniz domain adını koyun

  console.log(`🛠️ Mint işlemi başlatılıyor: ${domainName}...`);

  // Domain mint işlemini başlat
  const tx = await domainContract.mintDomain(domainName, 30000000);
  const receipt = await tx.wait();

  console.log(`✅ Domain başarıyla mint edildi: ${domainName}`);
  console.log(`🔗 İşlem Hash: ${receipt.transactionHash}`);
}

// Hata yakalama mekanizması
main().catch((error) => {
  console.error("❌ Hata oluştu:", error);
  process.exitCode = 1;
});
