const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  // Kontratın adresini girin
  const domainContractAddress = "0xCe5FFC86bbF58409AC380E11c5A4170Fd3b3C6Db";
  const htmlPageFactoryAddress = "0x44Fa33470e6bF1D065F1072BaA973a221442bE71";
  // DomainNFT kontratını bağla
  const DomainNFT = await hre.ethers.getContractFactory("DomainNFT");
  const HtmlPageFactory = await hre.ethers.getContractFactory(
    "HtmlPageFactory"
  );
  const domainContract = DomainNFT.attach(domainContractAddress);
  const htmlPageFactory = HtmlPageFactory.attach(htmlPageFactoryAddress);

  const walletAddress = "0x1F8B943E41Ef3D5c26b054Af2D8aa2C6988702f3";

  const balance = await domainContract.balanceOf(walletAddress);
  //   console.log(`Cüzdan ${walletAddress} toplam ${balance} adet NFT'ye sahip.`);

  let listOfDomains = [];

  // Her bir token için bilgileri alalım
  for (let i = 0; i < balance; i++) {
    try {
      // Token ID'yi alalım
      const tokenId = await domainContract.tokenOfOwnerByIndex(
        walletAddress,
        i
      );

      // Domain bilgisini alalım
      const ownerOf = await domainContract.ownerOf(tokenId);
      //   console.log({ ownerOf });
      if (ownerOf != hre.ethers.ZeroAddress) {
        const domain = await domainContract.getDomainByTokenId(tokenId);
        // listOfDomains.push({ tokenId: tokenId, domain: domain });
        const pageContract = await htmlPageFactory.getLinkedDomain(tokenId);
        if (pageContract == hre.ethers.ZeroAddress) {
          listOfDomains.push({ tokenId: tokenId, domain: domain });
        } else {
          listOfDomains.push({
            tokenId: tokenId,
            domain: domain,
            pageContract: pageContract,
          });
        }
      }
    } catch (err) {
      console.error(`Token #${i} için bilgi alınamadı:`, err.message);
    }
  }

  console.log({ listOfDomains });
}

// Hata yakalama mekanizması
main().catch((error) => {
  console.error("❌ Hata oluştu:", error);
  process.exitCode = 1;
});
