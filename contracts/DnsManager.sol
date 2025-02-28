// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract DomainNFT is ERC721Enumerable, Ownable {
    struct DomainInfo {
        uint256 expirationTime;
        string domain;
    }

    uint256 private _tokenIdCounter;
    uint256 public renewalFee = 0 ether; // Yenileme ücreti

    mapping(string => uint256) private domainToTokenId;
    mapping(uint256 => DomainInfo) private tokenIdToDomain;
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
        require(bytes(domain).length > 4, "Domain too short");
        require(
            keccak256(
                abi.encodePacked(
                    substring(
                        domain,
                        bytes(domain).length - 4,
                        bytes(domain).length
                    )
                )
            ) == keccak256(abi.encodePacked(".lib")),
            "Domain must end with .lib"
        );
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

    function substring(
        string memory str,
        uint256 startIndex,
        uint256 endIndex
    ) internal pure returns (string memory) {
        bytes memory strBytes = bytes(str);
        require(endIndex > startIndex, "Invalid indices");
        bytes memory result = new bytes(endIndex - startIndex);
        for (uint256 i = startIndex; i < endIndex; i++) {
            result[i - startIndex] = strBytes[i];
        }
        return string(result);
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

    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        //require(_ownerOf(tokenId) != address(0), "Token does not exist");

        string memory domain = tokenIdToDomain[tokenId].domain;
        string memory svg = generateSVG(domain);

        string memory json = string(
            abi.encodePacked(
                '{"name": "',
                domain,
                '", "description": "NFT domain for ',
                domain,
                '", "image": "data:image/svg+xml;base64,',
                Base64.encode(bytes(svg)),
                '"}'
            )
        );

        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(bytes(json))
                )
            );
    }

    function generateSVG(
        string memory domain
    ) internal pure returns (string memory) {
        return
            string(
                abi.encodePacked(
                    '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 60 60">',
                    "<title>domain</title>",
                    '<g id="Layer_2" data-name="Layer 2">',
                    '<g id="invisible_box" data-name="invisible box">',
                    '<rect width="60" height="60" fill="none"/>',
                    "</g>",
                    '<g id="icons_Q2" data-name="icons Q2" fill="#FF7200">',
                    '<path d="M24,2A22,22,0,1,0,46,24,21.9,21.9,0,0,0,24,2ZM40.1,16H35.2a27.8,27.8,0,0,0-3-8A18.5,18.5,0,0,1,40.1,16ZM42,24a17.5,17.5,0,0,1-.5,4H35.8c.1-1.3.2-2.6.2-4s-.1-2.7-.2-4h5.7A17.5,17.5,0,0,1,42,24ZM6,24a17.5,17.5,0,0,1,.5-4h5.7c-.1,1.3-.2,2.6-.2,4s.1,2.7.2,4H6.5A17.5,17.5,0,0,1,6,24Zm10,0c0-1.4.1-2.7.2-4H22v8H16.2C16.1,26.7,16,25.4,16,24ZM26,6.7a11.7,11.7,0,0,1,3,3.7A21.7,21.7,0,0,1,31.1,16H26Zm-4,0V16H16.9A21.7,21.7,0,0,1,19,10.4,11.7,11.7,0,0,1,22,6.7ZM22,32v9.3a11.7,11.7,0,0,1-3-3.7A21.7,21.7,0,0,1,16.9,32Zm4,9.3V32h5.1A21.7,21.7,0,0,1,29,37.6,11.7,11.7,0,0,1,26,41.3ZM26,28V20h5.8c.1,1.3.2,2.6.2,4s-.1,2.7-.2,4ZM15.8,8a27.8,27.8,0,0,0-3,8H7.9A18.5,18.5,0,0,1,15.8,8ZM7.9,32h4.9a27.8,27.8,0,0,0,3,8A18.5,18.5,0,0,1,7.9,32Zm24.3,8a27.8,27.8,0,0,0,3-8h4.9A18.5,18.5,0,0,1,32.2,40Z"/>',
                    "</g>",
                    "</g>",
                    '<text x="24" y="53" font-size="5px" text-anchor="middle" fill="black">',
                    domain,
                    "</text>",
                    "</svg>"
                )
            );
    }

    function getNFTExpiration(uint256 tokenId) external view returns (uint256) {
        return tokenIdToDomain[tokenId].expirationTime;
    }

    function getDomainByTokenId(
        uint256 tokenId
    ) external view returns (string memory) {
        if (tokenIdToDomain[tokenId].expirationTime < block.timestamp) {
            return "";
        }
        return tokenIdToDomain[tokenId].domain;
    }

    function getTokenIdByDomain(
        string memory domain
    ) external view returns (uint256) {
        uint256 _tokenId = domainToTokenId[domain];
        if (tokenIdToDomain[_tokenId].expirationTime < block.timestamp) {
            return 0;
        }
        return domainToTokenId[domain];
    }
}
