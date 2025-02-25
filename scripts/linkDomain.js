const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  // Deploy edilen `HtmlPageFactory` kontratının adresini gir
  const htmlPageFactoryAddress = "0x44Fa33470e6bF1D065F1072BaA973a221442bE71"; // Kendi kontrat adresinizi girin

  // Kontrata bağlan
  const HtmlPageFactory = await hre.ethers.getContractFactory(
    "HtmlPageFactory"
  );
  const HtmlPageFactoryContract = HtmlPageFactory.attach(
    htmlPageFactoryAddress
  );

  // Linklemek istediğin sayfa kontratı ve domain token ID
  const pageContractAddress = "0xaDE43B8059003696d37e4b84e8765Ae75141E7BA"; // Buraya sayfa kontrat adresini gir
  const tokenId = 1; // Buraya domain token ID'yi gir

  console.log(`🔗 Token ID ${tokenId} için domain sayfaya bağlanıyor...`);

  try {
    const tx = await HtmlPageFactoryContract.linkDomain(
      pageContractAddress,
      tokenId
    );
    const receipt = await tx.wait();
    console.log(`✅ Token ID ${tokenId} için domain başarıyla bağlandı.`);
  } catch (error) {
    console.error("❌ Hata oluştu:", error);
  }
}

// Hata yakalama mekanizması
main().catch((error) => {
  console.error("❌ Ana işlem sırasında hata oluştu:", error);
  process.exitCode = 1;
});
