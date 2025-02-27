const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  // Kontratın adresini girin
  const htmlPageFactoryAddress = "0x44Fa33470e6bF1D065F1072BaA973a221442bE71";
  const walletAddress = "0xb5c370ccFad112B70960CE9320B94ff1e695B1d5";

  // DomainNFT kontratını bağla
  const HtmlPageFactory = await hre.ethers.getContractFactory(
    "HtmlPageFactory"
  );
  const htmlPageFactoryContract = HtmlPageFactory.attach(
    htmlPageFactoryAddress
  );

  const userPages = await htmlPageFactoryContract.getUserPages(walletAddress);
  console.log({ userPages });
}

// Hata yakalama mekanizması
main().catch((error) => {
  console.error("❌ Hata oluştu:", error);
  process.exitCode = 1;
});
