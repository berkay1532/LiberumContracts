const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  // Deploy edilen `HtmlPageFactory` kontratının adresini gir
  const htmlPageFactoryAddress = "0x44Fa33470e6bF1D065F1072BaA973a221442bE71"; // Buraya kendi kontrat adresini koy

  // Kontrat bağlantısını al
  const HtmlPageFactory = await hre.ethers.getContractFactory(
    "HtmlPageFactory"
  );
  const HtmlPageFactoryContract = HtmlPageFactory.attach(
    htmlPageFactoryAddress
  );

  // Çağrılacak içerik
  const initialContent = `<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Merhaba Dünya</title>
</head>
<body>
    <h1>Merhaba Dünya</h1>
</body>
</html>
`;
  const name = "xx";
  console.log("📄 Yeni bir sayfa oluşturuluyor...");

  // createPage fonksiyonunu çağır
  const tx = await HtmlPageFactoryContract.createPage(initialContent, name);
  const receipt = await tx.wait();

  // Event loglarını tara ve PageCreated event'ini bul
  const event = receipt.logs.find(
    (log) => log.fragment?.name === "PageCreated"
  );

  if (event) {
    const newPageAddress = event.args[1]; // Event'ten oluşturulan kontrat adresini al
    console.log(`✅ Yeni sayfa başarıyla oluşturuldu: ${newPageAddress}`);
  } else {
    console.log(
      "⚠️ Sayfa oluşturma işlemi başarılı oldu fakat event bulunamadı."
    );
  }
}

// Hata yakalama mekanizması
main().catch((error) => {
  console.error("❌ Hata oluştu:", error);
  process.exitCode = 1;
});
