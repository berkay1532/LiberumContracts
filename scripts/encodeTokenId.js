const hre = require("hardhat");

async function main() {
  // Encode edilecek uint256 değeri
  const uintValue = 1; // Buraya encode etmek istediğin uint256 değerini gir

  console.log(`🔄 Encoding uint256: ${uintValue}`);

  // Uint256 değerini 32-byte padding ile hex formatına çevir
  const hexUint = hre.ethers.toBeHex(uintValue).slice(2).padStart(64, "0");

  // Final payload (Selector hariç)
  console.log("🟢 Encoded Payload (Selector Hariç):", hexUint);
}

// Hata yakalama mekanizması
main().catch((error) => {
  console.error("❌ Hata oluştu:", error);
  process.exitCode = 1;
});
