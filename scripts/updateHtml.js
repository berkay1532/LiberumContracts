const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  // Deploy edilen `HtmlPage` kontratının adresini gir
  const htmlPageAddress = "0x6011E10457f5FD9Adeb3d75325727111ea61795a"; // Buraya kendi kontrat adresini koy

  // Kontrat bağlantısını al
  const HtmlPage = await hre.ethers.getContractFactory("HtmlPage");
  const htmlPageContract = HtmlPage.attach(htmlPageAddress);

  // Çağrılacak içerik
  const newContent = `<!DOCTYPE html>
<html lang="tr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Metamask Bağlantı</title>
    <script src="https://cdn.jsdelivr.net/npm/web3/dist/web3.min.js"></script>
  </head>
  <body>
    <h1>Metamask Cüzdan Bağlantısı</h1>
    <button id="connectButton">Metamask Bağla</button>
    <p id="walletAddress"></p>

    <script>
      document
        .getElementById("connectButton")
        .addEventListener("click", async function () {
          if (window.ethereum) {
            try {
              const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
              });
              document.getElementById("walletAddress").innerText =
                "Bağlı Cüzdan: " + accounts[0];
            } catch (error) {
              console.error("Cüzdan bağlanırken hata oluştu:", error);
            }
          } else {
            console.log("Metamask veya bir Web3 cüzdanı yükleyin!");
          }
        });
    </script>
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
