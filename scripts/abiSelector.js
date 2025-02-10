const { ethers } = require("ethers");

const contract = require("../artifacts/contracts/Dns_Manage.sol/DomainNFT.json");

// `contractABI` nesnesi doğrudan `abi`'dir.
const contractABI = contract.abi;

if (!contractABI) {
  console.error(
    "ABI bulunamadı! Dosyanın doğru import edildiğinden emin olun."
  );
  process.exit(1);
}

// Fonksiyon selector'lerini hesaplayan fonksiyon
function getFunctionSelectors(abi) {
  return abi
    .filter((entry) => entry.type === "function") // Sadece fonksiyonları al
    .map((fn) => {
      const functionSignature = `${fn.name}(${fn.inputs
        .map((i) => i.type)
        .join(",")})`;
      const selector = ethers
        .keccak256(ethers.toUtf8Bytes(functionSignature))
        .slice(0, 10);
      return { functionSignature, selector };
    });
}

// Hesaplamaları yap ve ekrana yazdır
const results = getFunctionSelectors(contractABI);
console.log("Fonksiyon Selector'leri:");
results.forEach(({ functionSignature, selector }) => {
  console.log(`${functionSignature} => ${selector}`);
});
