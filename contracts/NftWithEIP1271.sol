// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.20;

// import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";
// import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
// import "@openzeppelin/contracts/interfaces/IERC1271.sol";

// contract MultiClientNFT is ERC721, Ownable {
//     using ECDSA for bytes32;

//     uint256 private _tokenIdCounter;
//     mapping(address => bool) public approvedContracts;

//     event Minted(address indexed minter, uint256 tokenId);

//     constructor() ERC721("MyNFT", "MNFT") Ownable(msg.sender) {}

//     function approveContract(
//         address contractAddress,
//         bool status
//     ) external onlyOwner {
//         approvedContracts[contractAddress] = status;
//     }

//     function mint(bytes memory signature) external {
//         require(_isValidSignature(msg.sender, signature), "Invalid signature");
//         _tokenIdCounter++;
//         _mint(msg.sender, _tokenIdCounter);
//         emit Minted(msg.sender, _tokenIdCounter);
//     }

//     function _isValidSignature(
//         address signer,
//         bytes memory signature
//     ) internal view returns (bool) {
//         bytes32 hashOfParams = keccak256(abi.encodePacked(signer, address(this)));
//         bytes32 messageHash = ECDSA.toEthSignedMessageHash(hashOfParams);

//         if (signer.code.length > 0) {
//             // Akıllı sözleşme mi kontrol et
//             if (approvedContracts[signer]) {
//                 bytes4 result = IERC1271(signer).isValidSignature(
//                     hashOfParams,
//                     signature
//                 );
//                 return result == 0x1626ba7e;
//             }
//             return false;
//         } else {
//             address recoveredSigner = messageHash.recover(signature);
//             return recoveredSigner == signer;
//         }
//     }
// }
