// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DomainNFT is ERC721Enumerable, Ownable {

    struct DomainInfo {
        uint256 expirationTime;
        string domain;
    }

    uint256 private _tokenIdCounter;
    uint256 public renewalFee = 0 ether; // Yenileme ücreti
    
    mapping(string => uint256) public domainToTokenId;
    mapping(uint256 => DomainInfo) public tokenIdToDomain;
    mapping(uint256 => address) private _owners;

    event DomainMinted(
        address indexed owner,
        string domain,
        uint256 tokenId,
        uint256 expirationTime
    );

    constructor() ERC721("DomainNFT", "DNFT") Ownable(msg.sender) {}

    // Duration should given as seconds type
    function mintDomain(
        string memory domain,
        uint256 initDuration
    ) external payable {
        require(domainToTokenId[domain] == 0, "Domain already minted");
        require(msg.value >= renewalFee, "Insufficient minting fee");
        _tokenIdCounter++;
        uint256 newTokenId = _tokenIdCounter;

        domainToTokenId[domain] = newTokenId;
        tokenIdToDomain[newTokenId] = DomainInfo({
            expirationTime: block.timestamp + initDuration,
            domain: domain
        });

        _owners[newTokenId] = msg.sender;
        _safeMint(msg.sender, newTokenId);
        emit DomainMinted(
            msg.sender,
            domain,
            newTokenId,
            tokenIdToDomain[newTokenId].expirationTime
        );
    }

    function renew(uint256 tokenId, uint256 extraDuration) external payable {
        require(ownerOf(tokenId) == msg.sender, "Only owner can renew");
        require(msg.value >= renewalFee, "Insufficient renewal fee");
        require(
            tokenIdToDomain[tokenId].expirationTime >= block.timestamp,
            "NFT expired, mint again"
        );

        tokenIdToDomain[tokenId].expirationTime += extraDuration;
    }

    function ownerOf(
        uint256 tokenId
    ) public view override(ERC721, IERC721) returns (address) {
        if (tokenIdToDomain[tokenId].expirationTime < block.timestamp) {
            return address(0);
        }
        return _owners[tokenId];
    }

    function getNFTExpiration(uint256 tokenId) external view returns (uint256) {
        return tokenIdToDomain[tokenId].expirationTime;
    }

    function getDomainByTokenId(
        uint256 tokenId
    ) external view returns (string memory) {
        return tokenIdToDomain[tokenId].domain;
    }

    function getTokenIdByDomain(
        string memory domain
    ) external view returns (uint256) {
        return domainToTokenId[domain];
    }
}
