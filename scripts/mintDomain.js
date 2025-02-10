const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  // Kontratın adresini girin
  const contractAddress = "0x2E1C3417dA2D3309463740B3B4Ac2888aF4ee651"; // <-- Buraya kendi kontrat adresinizi koyun

  // DomainNFT kontratını bağla
  const DomainNFT = await hre.ethers.getContractFactory("DomainNFT");
  const domainContract = DomainNFT.attach(contractAddress);

  // Mint edilecek domain adı
  const domainName = "beko.lib"; // <-- Buraya istediğiniz domain adını koyun

  console.log(`🛠️ Mint işlemi başlatılıyor: ${domainName}...`);

  // Domain mint işlemini başlat
  const tx = await domainContract.mintDomain(domainName);
  const receipt = await tx.wait();

  console.log(`✅ Domain başarıyla mint edildi: ${domainName}`);
  console.log(`🔗 İşlem Hash: ${receipt.transactionHash}`);
}

// Hata yakalama mekanizması
main().catch((error) => {
  console.error("❌ Hata oluştu:", error);
  process.exitCode = 1;
});
