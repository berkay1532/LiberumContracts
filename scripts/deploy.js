const hre = require("hardhat");

async function main() {
  // Kontratları derleyelim
  await hre.run("compile");

  console.log("🚀 Deploying...");

  // DnsManager Contract deploy
  const Contract1 = await hre.ethers.getContractFactory("DomainNFT");
  const contract1 = await Contract1.deploy();
  await contract1.waitForDeployment();
  console.log(`✅ Contract1 deployed to: ${await contract1.getAddress()}`);

  // HtmlPageFactory Contract deploy
  const Contract2 = await hre.ethers.getContractFactory("HtmlPageFactory");
  const contract2 = await Contract2.deploy(await contract1.getAddress());
  await contract2.waitForDeployment();
  console.log(`✅ Contract2 deployed to: ${await contract2.getAddress()}`);

  console.log("🎉 All contracts deployed successfully!");
}

// Error handling
main().catch((error) => {
  console.error("❌ Hata oluştu:", error);
  process.exitCode = 1;
});
