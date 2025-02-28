const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  // HtmlPage contract address
  const htmlPageAddress = "0xbB0F8Eb109872F6bE4CbEd844cD4228911128fD8";

  const HtmlPageContract = await hre.ethers.getContractFactory("HtmlPage");
  const htmlPageContract = HtmlPageContract.attach(htmlPageAddress);

  const ownerOfContent = await htmlPageContract.owner();
  console.log({ ownerOfContent });

  const name = await htmlPageContract.name();
  console.log({ name });

  const createdTimestamp = await htmlPageContract.createdTimestamp();
  console.log({ createdTimestamp });

  const updatedTimestamp = await htmlPageContract.updatedTimestamp();
  console.log({ updatedTimestamp });
}


main().catch((error) => {
  console.error("❌ Error occured:", error);
  process.exitCode = 1;
});
