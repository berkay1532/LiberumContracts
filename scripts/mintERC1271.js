const hre = require("hardhat");

async function main() {
  // PRIVATE KEY'İNİ BURAYA GİR (KESİNLİKLE GÜVENLİ ORTAMDA KULLAN!)
  const privateKey = "";

  // Kontratın adresini tanımla
  const contractAddress = "0xf6233D6d8Ae30C943bc8ECF07b5dd1c705326BAA";

  // RPC Sağlayıcıyı Tanımla (Mainnet/Testnet için doğru RPC'yi kullan!)
  const provider = new hre.ethers.JsonRpcProvider(
    "https://ethereum-sepolia-rpc.publicnode.com"
  );

  // Gerçek cüzdanı oluştur
  const wallet = new hre.ethers.Wallet(privateKey, provider);

  console.log(`🔹 Kullanıcı Adresi: ${wallet.address}`);

  // İmzalanması gereken mesajı oluştur (EOA için)
  const messageHash = hre.ethers.keccak256(
    ["address", "address"],
    [wallet.address, contractAddress]
  );
  const messageBytes = hre.ethers.utils.arrayify(messageHash);

  console.log(`🛠️ İmzalanacak Hash: ${messageHash}`);

  // Cüzdan ile imzalama
  const signature = await wallet.signMessage(messageBytes);

  console.log(`✅ Üretilen İmza: ${signature}`);
}

// Hata yakalama mekanizması
main().catch((error) => {
  console.error("❌ Hata oluştu:", error);
  process.exitCode = 1;
});
