// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DomainNFT is ERC721URIStorage, Ownable {
    uint256 private _tokenIdCounter;
    mapping(string => uint256) public domainToTokenId;
    mapping(uint256 => string) public tokenIdToDomain;

    event DomainMinted(address indexed owner, string domain, uint256 tokenId);

    constructor() ERC721("DomainNFT", "DNFT") Ownable(msg.sender) {}

    function mintDomain(string memory domain) external {
        require(domainToTokenId[domain] == 0, "Domain already minted");

        _tokenIdCounter++;
        uint256 newTokenId = _tokenIdCounter;
        _safeMint(msg.sender, newTokenId);

        domainToTokenId[domain] = newTokenId;
        tokenIdToDomain[newTokenId] = domain;

        emit DomainMinted(msg.sender, domain, newTokenId);
    }

    function getDomainByTokenId(
        uint256 tokenId
    ) external view returns (string memory) {
        return tokenIdToDomain[tokenId];
    }

    function getTokenIdByDomain(
        string memory domain
    ) external view returns (uint256) {
        return domainToTokenId[domain];
    }
}
