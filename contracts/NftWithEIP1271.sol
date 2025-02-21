// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";

contract MultiClientNFT is ERC721 {
    uint256 private _tokenIdCounter;

    event Minted(address indexed minter, uint256 tokenId);

    constructor(
        string memory name,
        string memory symbol
    ) ERC721(name, symbol) {}

    function mint(bytes memory signature) external {
        require(_isValidSignature(msg.sender, signature), "Invalid signature");
        _tokenIdCounter++;
        _mint(msg.sender, _tokenIdCounter);
        emit Minted(msg.sender, _tokenIdCounter);
    }

    function _isValidSignature(
        address signer,
        bytes memory signature
    ) internal view returns (bool) {
        bytes32 messageHash = keccak256(
            abi.encodePacked(signer, address(this), "beko.lib") //minter, ca, domain
        );

        return
            SignatureChecker.isValidSignatureNow(
                signer,
                messageHash,
                signature
            );
    }
}
