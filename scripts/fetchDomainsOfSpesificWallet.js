const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  // DomainNFT contract address
  const domainContractAddress = "0x918f80Fc9aD946b27D989feD8c99A66d35584d41";
  // HtmlPageFactory contract address
  const htmlPageFactoryAddress = "0xea2DC82269D187F2336B1B243B29D23eB9d62D59";
  const DomainNFT = await hre.ethers.getContractFactory("DomainNFT");
  const HtmlPageFactory = await hre.ethers.getContractFactory(
    "HtmlPageFactory"
  );
  const domainContract = DomainNFT.attach(domainContractAddress);
  const htmlPageFactory = HtmlPageFactory.attach(htmlPageFactoryAddress);

  const walletAddress = "0x1F8B943E41Ef3D5c26b054Af2D8aa2C6988702f3";

  const balance = await domainContract.balanceOf(walletAddress);

  let listOfDomains = [];

  for (let i = 0; i < balance; i++) {
    try {
      const tokenId = await domainContract.tokenOfOwnerByIndex(
        walletAddress,
        i
      );

      const ownerOf = await domainContract.ownerOf(tokenId);

      if (ownerOf != hre.ethers.ZeroAddress) {
        const domain = await domainContract.getDomainByTokenId(tokenId);
        const expiration_date = await domainContract.getNFTExpiration(tokenId);
        const pageContract = await htmlPageFactory.getLinkedDomain(tokenId);
        if (pageContract == hre.ethers.ZeroAddress) {
          listOfDomains.push({
            tokenId: tokenId,
            domain: domain,
            expiration_date: expiration_date,
          });
        } else {
          listOfDomains.push({
            tokenId: tokenId,
            domain: domain,
            pageContract: pageContract,
            expiration_date: expiration_date,
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

  console.log({ listOfDomains });
}

main().catch((error) => {
  console.error("❌ Error occured:", error);
  process.exitCode = 1;
});
