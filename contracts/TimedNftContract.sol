// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TimedNFT is ERC721Enumerable, Ownable {
    struct NFTInfo {
        uint256 expirationTime;
    }

    mapping(uint256 => NFTInfo) public nftDetails;
    mapping(uint256 => address) private _owners;
    uint256 public nextTokenId;
    uint256 public baseDuration = 365 days; // NFT süresi (1 yıl olarak ayarlandı)
    uint256 public renewalFee = 0.01 ether; // Yenileme ücreti

    constructor() ERC721("TimedNFT", "TNFT") Ownable(msg.sender) {}

    function mint() external payable {
        require(msg.value >= renewalFee, "Insufficient minting fee");
        uint256 tokenId = nextTokenId++;

        nftDetails[tokenId] = NFTInfo({
            expirationTime: block.timestamp + baseDuration
        });

        _owners[tokenId] = msg.sender;
        _safeMint(msg.sender, tokenId);
    }

    function renew(uint256 tokenId) external payable {
        require(ownerOf(tokenId) == msg.sender, "Only owner can renew");
        require(msg.value >= renewalFee, "Insufficient renewal fee");
        require(
            nftDetails[tokenId].expirationTime >= block.timestamp,
            "NFT expired, mint again"
        );

        nftDetails[tokenId].expirationTime += baseDuration;
    }

    function ownerOf(
        uint256 tokenId
    ) public view override(ERC721, IERC721) returns (address) {
        if (nftDetails[tokenId].expirationTime < block.timestamp) {
            return address(0);
        }
        return _owners[tokenId];
    }

    function getNFTExpiration(uint256 tokenId) external view returns (uint256) {
        return nftDetails[tokenId].expirationTime;
    }
}
