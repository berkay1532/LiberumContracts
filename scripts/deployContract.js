const hre = require("hardhat");

async function main() {
  // Kontratları derleyelim
  await hre.run("compile");

  console.log("🚀 Deploy başlatılıyor...");

  // 1. Kontratın deploy edilmesi
  const Contract1 = await hre.ethers.getContractFactory("DomainNFT");
  const contract1 = await Contract1.deploy();
  await contract1.waitForDeployment();
  console.log(`✅ Contract1 deployed to: ${await contract1.getAddress()}`);
}

// Hata yakalama mekanizması
main().catch((error) => {
  console.error("❌ Hata oluştu:", error);
  process.exitCode = 1;
});
