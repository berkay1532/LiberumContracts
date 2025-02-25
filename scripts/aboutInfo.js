const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  // Kontratın adresini girin
  const domainContractAddress = "0xc38705e4EBB6806caEB7eD1fE3F0372325E5baD3";
  const htmlPageFactoryAddress = "0xBc78D131A45e43f7427127cB7c5D8D6bFC9Fe209";
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
  const domainName = "eraypektas"; // <-- Buraya istediğiniz domain adını koyun

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
  //   const createdTimestamp = await htmlContentPageContract.createdTimestamp();
  //   console.log({ createdTimestamp });
}

// Hata yakalama mekanizması
main().catch((error) => {
  console.error("❌ Hata oluştu:", error);
  process.exitCode = 1;
});
