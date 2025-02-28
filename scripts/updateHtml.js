const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  // `HtmlPage` contract address
  const htmlPageAddress = "0xbB0F8Eb109872F6bE4CbEd844cD4228911128fD8";

  const HtmlPage = await hre.ethers.getContractFactory("HtmlPage");
  const htmlPageContract = HtmlPage.attach(htmlPageAddress);

  // new content
  const newContent = `<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hello World</title>
</head>
<body>
    <h1>Hello World</h1>
</body>
</html>
`;

  console.log("📄 Page is updating...");

  // function call
  const tx = await htmlPageContract.updateContent(newContent);
  const receipt = await tx.wait();
  // Search ContentUpdated event logs
  const event = receipt.logs.find(
    (log) => log.fragment?.name === "ContentUpdated"
  );

  if (event) {
    console.log(`✅ Page updated successfully`);
  } else {
    console.log("⚠️ Event could not find");
  }
}

// Hata yakalama mekanizması
main().catch((error) => {
  console.error("❌ Hata oluştu:", error);
  process.exitCode = 1;
});
