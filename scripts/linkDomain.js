const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  // Deploy edilen `HtmlPageFactory` kontratının adresini gir
  const htmlPageFactoryAddress = "0x3E686ED14C6519fa5e4e9aFfCa7860173eC75Ff1"; // Kendi kontrat adresinizi girin

  // Kontrata bağlan
  const HtmlPageFactory = await hre.ethers.getContractFactory(
    "HtmlPageFactory"
  );
  const HtmlPageFactoryContract = HtmlPageFactory.attach(
    htmlPageFactoryAddress
  );

  // Linklemek istediğin sayfa kontratı ve domain token ID
  const pageContractAddress = "0x6011E10457f5FD9Adeb3d75325727111ea61795a"; // Buraya sayfa kontrat adresini gir
  const tokenId = 2; // Buraya domain token ID'yi gir

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
