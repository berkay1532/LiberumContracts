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
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Ethereum RPC DomainNFT Test</title>
  </head>
  <body>
    <h1>DomainNFT Test Panel (JSON-RPC)</h1>

    <label>Domain Name:</label>
    <input type="text" id="domainInput" placeholder="example.eth" />
    <button id="getTokenIdByDomain">Get Token ID</button>
    <p id="tokenIdResult">Token ID will appear here...</p>

    <label>Token ID:</label>
    <input type="number" id="tokenIdInput" />
    <button id="getDomainByTokenId">Get Domain</button>
    <p id="domainResult">Domain will appear here...</p>

    <h1>Ethereum RPC Call Example</h1>
    <button id="getOwner">Get Owner</button>
    <p id="result">Owner will appear here...</p>
    <script>
      const rpcUrl =
        "https://rpc-mammothon-g2-testnet-4a2w8v0xqy.t.conduit.xyz"; // RPC endpoint'inizi girin
      const contractAddress = "0x2E1C3417dA2D3309463740B3B4Ac2888aF4ee651"; // Kontrat adresini girin

      // Domain için Token ID alma
      document.getElementById("getTokenIdByDomain").onclick =
        async function () {
          const domain = document.getElementById("domainInput").value;
          if (!domain) {
            alert("Please enter a domain!");
            return;
          }
          // 1. Offset (Sabit Değer)
          const offsetHex =
            "0000000000000000000000000000000000000000000000000000000000000020";

          // 2. Domain Uzunluğu (Hex ve 32 Byte)
          const domainLengthHex = domain.length.toString(16).padStart(64, "0");

          // 3. Domain'i hex formatına çevir
          const domainHex = toHex(domain);

          // 4. 32 byte’a tamamlamak için sıfır ekle
          const paddedDomainHex = domainHex.padEnd(64, "0");

          // 5. Nihai Hex Formatı
          const finalHex = offsetHex + domainLengthHex + paddedDomainHex;

          console.log(finalHex);
          // const domainHex =
          //   "0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000862656b6f2e6c6962000000000000000000000000000000000000000000000000"; //for beko.lib
          const payload = {
            jsonrpc: "2.0",
            method: "eth_call",
            params: [
              {
                to: "0x2E1C3417dA2D3309463740B3B4Ac2888aF4ee651",
                data: "0xbca6eec4" + finalHex, // keccak256 of get token id by domain mapping abi
              },
              "latest",
            ],
            id: 1,
          };

          try {
            const response = await fetch(rpcUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            });

            const data = await response.json();
            console.log(data);
            if (data.result) {
              const tokenId = parseInt(data.result, 16); // Hex'i integer'a çevir
              document.getElementById("tokenIdResult").textContent =
                "Token ID: " + tokenId;
            } else {
              document.getElementById("tokenIdResult").textContent =
                "Error fetching Token ID.";
            }
          } catch (error) {
            document.getElementById("tokenIdResult").textContent =
              "Error: " + error.message;
          }
        };

      // Str to hex
      function toHex(str) {
        return Array.from(str)
          .map((c) => c.charCodeAt(0).toString(16).padStart(2, "0"))
          .join("");
      }
      // Ethereum ABI'ye uygun şekilde response'ı işle
      function parseDomainResult(hex) {
        hex = hex.slice(2); // "0x" başlığını kaldır

        const offset = parseInt(hex.slice(0, 64), 16); // İlk 32 byte -> Offset (Genelde 0x20)
        const length = parseInt(hex.slice(64, 128), 16); // İkinci 32 byte -> String uzunluğu
        const domainHex = hex.slice(128, 128 + length * 2); // String verisi (length kadar byte)

        return hexToAscii(domainHex);
      }

      // Web3.js yerine saf JavaScript ile hexToAscii dönüşüm fonksiyonu
      function hexToAscii(hex) {
        let str = "";
        for (let i = 0; i < hex.length; i += 2) {
          let charCode = parseInt(hex.substr(i, 2), 16);
          str += String.fromCharCode(charCode);
        }
        return str.trim(); // Sonunda gereksiz boşluk veya null karakterleri kaldır
      }
      // Token ID için Domain alma
      document.getElementById("getDomainByTokenId").onclick =
        async function () {
          const tokenId = document.getElementById("tokenIdInput").value;
          if (!tokenId) {
            document.getElementById("domainResult").textContent =
              "Please enter a Token ID!";
            return;
          }
          // Token ID'yi integer'a çevir ve hex formatına getir
          let hexTokenId = BigInt(tokenId).toString(16);
          // 64 karaktere tamamlamak için başına sıfır ekle
          hexTokenId = hexTokenId.padStart(64, "0");
          // const hexTokenId =
          //   "0000000000000000000000000000000000000000000000000000000000000002";
          const payload = {
            jsonrpc: "2.0",
            method: "eth_call",
            params: [
              {
                to: "0x2E1C3417dA2D3309463740B3B4Ac2888aF4ee651", // Kontrat adresini buraya koyun
                data: "0x8cd108de" + hexTokenId, // getDomainByTokenId metodunun Keccak256 ilk 4 byte + token ID hex
              },
              "latest",
            ],
            id: 1,
          };

          try {
            const response = await fetch(rpcUrl, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(payload),
            });

            const data = await response.json();
            console.log(data);
            if (data.result) {
              const domain = hexToAscii(data.result);
              document.getElementById("domainResult").textContent =
                "Domain: " + domain;
            } else {
              document.getElementById("domainResult").textContent =
                "Error fetching Domain.";
            }
          } catch (error) {
            document.getElementById("domainResult").textContent =
              "Error: " + error.message;
          }
        };

      document.getElementById("getOwner").onclick = async function () {
        const payload = {
          jsonrpc: "2.0",
          method: "eth_call",
          // NOTE: This payload can be anything to read from chain
          params: [
            {
              to: "0x6011E10457f5FD9Adeb3d75325727111ea61795a", // address of the HTML contract
              data: "0x8da5cb5b", // Keccak256 of owner() ABI
            },
            "latest",
          ],
          id: 1,
        };

        try {
          const response = await fetch(rpcUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });
          console.log(response);
          const data = await response.json();
          console.log(data);
          // Handle the result (totalSupply is in the data.result, and is in hex format)
          if (data.result) {
            const owner = "0x" + data.result.slice(26);
            document.getElementById("result").textContent = "Owner: " + owner;
          } else {
            document.getElementById("result").textContent =
              "Error fetching data.";
          }
        } catch (error) {
          document.getElementById("result").textContent =
            "Error: " + error.message;
        }
      };
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
