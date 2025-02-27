const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  // Kontratın adresini girin
  const domainContractAddress = "0xCe5FFC86bbF58409AC380E11c5A4170Fd3b3C6Db";
  const htmlPageFactoryAddress = "0x44Fa33470e6bF1D065F1072BaA973a221442bE71";
  // DomainNFT kontratını bağla
  const DomainNFT = await hre.ethers.getContractFactory("DomainNFT");
  const HtmlPageFactory = await hre.ethers.getContractFactory(
    "HtmlPageFactory"
  );
  const domainContract = DomainNFT.attach(domainContractAddress);
  const htmlPageFactoryContract = HtmlPageFactory.attach(
    htmlPageFactoryAddress
  );

  // Mint edilecek domain adı
  const domainName = "senos.lib"; // <-- Buraya istediğiniz domain adını koyun

  // Domain mint işlemini başlat
  const tokenId = await domainContract.getTokenIdByDomain(domainName);
  console.log({ tokenId });

  const contentAddress = await htmlPageFactoryContract.getLinkedDomain(tokenId);
  console.log({ contentAddress });

  const htmlContentPage = await hre.ethers.getContractFactory("HtmlPage");
  const htmlContentPageContract = htmlContentPage.attach(contentAddress);

  const ownerOfContent = await htmlContentPageContract.owner();
  console.log({ ownerOfContent });

  const name = await htmlContentPageContract.name();
  console.log({ name });
  const content = await htmlContentPageContract.GET("");
  console.log({ content });
  const createdTimestamp = await htmlContentPageContract.createdTimestamp();
  console.log({ createdTimestamp });
  const updatedTimestamp = await htmlContentPageContract.updatedTimestamp();
  console.log({ updatedTimestamp });
}

// Hata yakalama mekanizması
main().catch((error) => {
  console.error("❌ Hata oluştu:", error);
  process.exitCode = 1;
});
