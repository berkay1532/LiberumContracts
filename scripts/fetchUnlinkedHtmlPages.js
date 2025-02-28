const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  // Kontratın adresini girin
  const domainContractAddress = "0xCe5FFC86bbF58409AC380E11c5A4170Fd3b3C6Db";
  const htmlPageFactoryAddress = "0x44Fa33470e6bF1D065F1072BaA973a221442bE71";
  const walletAddress = "0x1F8B943E41Ef3D5c26b054Af2D8aa2C6988702f3";

  // DomainNFT kontratını bağla

  const DomainNFT = await hre.ethers.getContractFactory("DomainNFT");
  const HtmlPageFactory = await hre.ethers.getContractFactory(
    "HtmlPageFactory"
  );
  const domainContract = DomainNFT.attach(domainContractAddress);
  const htmlPageFactoryContract = HtmlPageFactory.attach(
    htmlPageFactoryAddress
  );

  const userPages = await htmlPageFactoryContract.getUserPages(walletAddress);
  //   console.log({ userPages });

  const balance = await domainContract.balanceOf(walletAddress);
  //   console.log(`Cüzdan ${walletAddress} toplam ${balance} adet NFT'ye sahip.`);

  let listOfPages = [];

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
      console.error(`Token #${i} için bilgi alınamadı:`, err.message);
    }
  }
  // Tüm userPages için döngü oluştur
  for (let page of userPages) {
    // Bu page'in pageContract'ı listOfPages içinde var mı diye kontrol et
    const existsInList = listOfPages.some((item) => item.pageContract === page);
    // Eğer yoksa, available olarak listeye ekle
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
  console.log("Toplam liste uzunluğu", listOfPages.length);
}

// Hata yakalama mekanizması
main().catch((error) => {
  console.error("❌ Hata oluştu:", error);
  process.exitCode = 1;
});
