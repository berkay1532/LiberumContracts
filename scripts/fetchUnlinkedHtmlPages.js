const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  // Contract addresses
  const domainContractAddress = "0x918f80Fc9aD946b27D989feD8c99A66d35584d41";
  const htmlPageFactoryAddress = "0xea2DC82269D187F2336B1B243B29D23eB9d62D59";
  const walletAddress = "0x1F8B943E41Ef3D5c26b054Af2D8aa2C6988702f3";

  const DomainNFT = await hre.ethers.getContractFactory("DomainNFT");
  const HtmlPageFactory = await hre.ethers.getContractFactory(
    "HtmlPageFactory"
  );
  const domainContract = DomainNFT.attach(domainContractAddress);
  const htmlPageFactoryContract = HtmlPageFactory.attach(
    htmlPageFactoryAddress
  );

  const userPages = await htmlPageFactoryContract.getUserPages(walletAddress);

  const balance = await domainContract.balanceOf(walletAddress);

  let listOfPages = [];

  for (let i = 0; i < balance; i++) {
    try {
      const tokenId = await domainContract.tokenOfOwnerByIndex(
        walletAddress,
        i
      );
      const ownerOf = await domainContract.ownerOf(tokenId);
      if (ownerOf != hre.ethers.ZeroAddress) {
        const domain = await domainContract.getDomainByTokenId(tokenId);
        const pageContract = await htmlPageFactoryContract.getLinkedDomain(
          tokenId
        );
        if (pageContract != hre.ethers.ZeroAddress) {
          const HtmlPage = await hre.ethers.getContractFactory("HtmlPage");
          const htmlPage = HtmlPage.attach(pageContract);
          const name = await htmlPage.name();
          listOfPages.push({
            name: name,
            pageContract: pageContract,
            status: "linked",
            domain: domain,
            tokenId: tokenId,
          });
        }
      }
    } catch (err) {
      console.error(
        `Information could not get for this TokenId #${i} :`,
        err.message
      );
    }
  }
  for (let page of userPages) {
    const existsInList = listOfPages.some((item) => item.pageContract === page);
    if (!existsInList) {
      const HtmlPage = await hre.ethers.getContractFactory("HtmlPage");
      const htmlPage = HtmlPage.attach(page);
      const name = await htmlPage.name();
      listOfPages.push({
        name: name,
        pageContract: page,
        status: "available",
      });
    }
  }
  console.log({ listOfPages });
  console.log("Total list length", listOfPages.length);
}

main().catch((error) => {
  console.error("❌ Error occured:", error);
  process.exitCode = 1;
});
