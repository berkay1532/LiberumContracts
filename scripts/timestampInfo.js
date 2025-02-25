const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  // Kontratın adresini girin
  const htmlPageAddress = "0x3F05808be95F40f855BAc1C2C3347fc5b47364C3";

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

// Hata yakalama mekanizması
main().catch((error) => {
  console.error("❌ Hata oluştu:", error);
  process.exitCode = 1;
});
