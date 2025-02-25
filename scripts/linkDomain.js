const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  // Deploy edilen `HtmlPageFactory` kontratının adresini gir
  const htmlPageFactoryAddress = "0xBc78D131A45e43f7427127cB7c5D8D6bFC9Fe209"; // Kendi kontrat adresinizi girin

  // Kontrata bağlan
  const HtmlPageFactory = await hre.ethers.getContractFactory(
    "HtmlPageFactory"
  );
  const HtmlPageFactoryContract = HtmlPageFactory.attach(
    htmlPageFactoryAddress
  );

  // Linklemek istediğin sayfa kontratı ve domain token ID
  const pageContractAddress = "0x479EC33987818aFf1EbC53817B9a33a7F36742Bb"; // Buraya sayfa kontrat adresini gir
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
