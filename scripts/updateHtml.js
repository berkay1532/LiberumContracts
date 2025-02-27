const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  // Deploy edilen `HtmlPage` kontratının adresini gir
  const htmlPageAddress = "0x631D0f30915d732AeC1de3E67fD62613D1843368"; // Buraya kendi kontrat adresini koy

  // Kontrat bağlantısını al
  const HtmlPage = await hre.ethers.getContractFactory("HtmlPage");
  const htmlPageContract = HtmlPage.attach(htmlPageAddress);

  // Çağrılacak içerik
  const newContent = `<!DOCTYPE html>
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

  console.log("📄 Sayfa güncelleniyor...");

  // createPage fonksiyonunu çağır
  const tx = await htmlPageContract.updateContent(newContent);
  const receipt = await tx.wait();
  // Event loglarını tara ve ContentUpdated event'ini bul
  const event = receipt.logs.find(
    (log) => log.fragment?.name === "ContentUpdated"
  );

  if (event) {
    // const newPageAddress = event.args[1]; // Event'ten oluşturulan kontrat adresini al
    console.log(`✅ Sayfa başarıyla güncellendi`);
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
