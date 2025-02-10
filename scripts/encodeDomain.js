const hre = require("hardhat");

async function main() {
  // Encode edilecek domain
  const domainName = "beko.lib"; // Buraya encode etmek istediğin domain adını gir

  console.log(`🔄 Encoding domain: ${domainName}`);

  // String'i Hex formatına çevirme
  const domainBytes = Buffer.from(domainName, "utf8");
  const domainPadded = Buffer.concat([
    domainBytes,
    Buffer.alloc(32 - domainBytes.length),
  ]); // 32-byte padding

  // Domain için Hex formatı
  const domainHex = domainPadded.toString("hex");

  // Offset ve Length (Ethereum ABI encoding formatına göre)
  const domainOffset =
    "0000000000000000000000000000000000000000000000000000000000000020"; // Offset (32 byte)
  const domainLength = domainBytes.length.toString(16).padStart(64, "0"); // String uzunluğunu Hex formatına çevirme (32 byte)

  // Final payload (Selector hariç)
  const payload = domainOffset + domainLength + domainHex;

  console.log("🟢 Encoded Payload (Selector Hariç):", payload);
}

// Hata yakalama mekanizması
main().catch((error) => {
  console.error("❌ Hata oluştu:", error);
  process.exitCode = 1;
});
