// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./IHtml.sol";

contract HtmlPage is IHtml {
    string public name;
    address public owner;
    uint256 public createdTimestamp = 0;
    uint256 public updatedTimestamp = 0;
    string private htmlContent;

    event ContentUpdated(address indexed owner, string newContent);
    event NameUpdated(address indexed owner, string newName);

    constructor(string memory initialContent, string memory _name) {
        owner = tx.origin;
        htmlContent = initialContent;
        name = _name;
        createdTimestamp = block.timestamp;
        updatedTimestamp = createdTimestamp;
    }

    function GET(string memory) public view returns (string memory) {
        return htmlContent;
    }

    function POST(bytes memory) public pure returns (string memory) {
        return "POST reqeusts not supported";
    }

    function getFileName() public view returns (string memory) {
        return name;
    }

    function updateContent(string memory newContent) external onlyOwner {
        htmlContent = newContent;
        emit ContentUpdated(owner, newContent);
        updatedTimestamp = block.timestamp;
    }

    function updateName(string memory newName) external onlyOwner {
        name = newName;
        emit NameUpdated(owner, newName);
    }

    modifier onlyOwner() {
        require(tx.origin == owner, "Not the owner");
        _;
    }
}
