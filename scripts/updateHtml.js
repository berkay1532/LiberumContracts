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
  <title>Metamask Bağlantı Testi</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      padding: 20px;
    }
    button {
      padding: 10px 20px;
      font-size: 16px;
    }
  </style>
</head>
<body>
  <h1>Metamask Bağlantı Testi</h1>
  <button id="connectButton">Metamask'e Bağlan</button>

  <script>
    async function connectMetamask() {
     
      if (window.ethereum) {
        try {
          
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          console.log('Bağlanan hesaplar:', accounts);
          alert('Bağlantı başarılı! Hesap: ' + accounts[0]);
        } catch (error) {
          console.error('Bağlantı reddedildi:', error);
          alert('Bağlantı reddedildi.');
        }
      } else {
        alert('Metamask bulunamadı. Lütfen tarayıcınıza Metamask ekleyin.');
      }
    }

    document.getElementById('connectButton').addEventListener('click', connectMetamask);
  </script>
</body>
</html>`;

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
