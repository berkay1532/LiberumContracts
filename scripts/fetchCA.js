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

  // Sorgulamak istediğin tokenId
  const tokenId = 1; // Buraya istediğin tokenId'yi gir

  console.log(
    `🔍 Token ID ${tokenId} için bağlı domain adresi sorgulanıyor...`
  );

  try {
    const linkedDomain = await HtmlPageFactoryContract.pageLinkedDomain(
      tokenId
    );
    console.log(
      `✅ Token ID ${tokenId} için bağlı domain adresi: ${linkedDomain}`
    );
  } catch (error) {
    console.error("❌ Hata oluştu:", error);
  }
}

// Hata yakalama mekanizması
main().catch((error) => {
  console.error("❌ Ana işlem sırasında hata oluştu:", error);
  process.exitCode = 1;
});
