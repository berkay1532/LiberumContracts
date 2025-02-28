const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  // Kontratın adresini girin
  const domainContractAddress = "0x918f80Fc9aD946b27D989feD8c99A66d35584d41";
  const htmlPageFactoryAddress = "0xea2DC82269D187F2336B1B243B29D23eB9d62D59";
  // DomainNFT kontratını bağla
  const DomainNFT = await hre.ethers.getContractFactory("DomainNFT");
  const HtmlPageFactory = await hre.ethers.getContractFactory(
    "HtmlPageFactory"
  );
  const domainContract = DomainNFT.attach(domainContractAddress);
  const htmlPageFactoryContract = HtmlPageFactory.attach(
    htmlPageFactoryAddress
  );

  // Domain name which will minted
  const domainName = "domain.lib"; // <-- Buraya istediğiniz domain adını koyun

  // Start minting process
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

// Error handling
main().catch((error) => {
  console.error("❌ Hata oluştu:", error);
  process.exitCode = 1;
});
