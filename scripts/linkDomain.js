const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  // `HtmlPageFactory` contract address
  const htmlPageFactoryAddress = "0xea2DC82269D187F2336B1B243B29D23eB9d62D59";

  const HtmlPageFactory = await hre.ethers.getContractFactory(
    "HtmlPageFactory"
  );
  const HtmlPageFactoryContract = HtmlPageFactory.attach(
    htmlPageFactoryAddress
  );

  const pageContractAddress = "0xbB0F8Eb109872F6bE4CbEd844cD4228911128fD8";
  const tokenId = 3; // domain token id

  console.log(`🔗 Token ID ${tokenId} is linking this domain...`);

  try {
    const tx = await HtmlPageFactoryContract.linkDomain(
      pageContractAddress,
      tokenId
    );
    const receipt = await tx.wait();
    console.log(`✅ Token ID ${tokenId} linked this domain succesfully.`);
  } catch (error) {
    console.error("❌ Error occured:", error);
  }
}

main().catch((error) => {
  console.error("❌ Error occured:", error);
  process.exitCode = 1;
});
