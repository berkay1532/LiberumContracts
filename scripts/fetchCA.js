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

  const tokenId = 1;

  console.log(`🔍 Which domain address belongs to this Token ID ${tokenId}`);

  try {
    const linkedDomain = await HtmlPageFactoryContract.pageLinkedDomain(
      tokenId
    );
    console.log(
      `✅ Token ID ${tokenId} belongs to this domain address: ${linkedDomain}`
    );
  } catch (error) {
    console.error("❌ Error occured:", error);
  }
}

main().catch((error) => {
  console.error("❌ Error occured:", error);
  process.exitCode = 1;
});
