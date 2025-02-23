// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./IHtml.sol";

contract HtmlPage is IHtml {
    string public name;
    address public owner;
    string private htmlContent;

    event ContentUpdated(address indexed owner, string newContent);
    event NameUpdated(address indexed owner, string newName);

    constructor(string memory initialContent, string memory _name) {
        owner = tx.origin;
        htmlContent = initialContent;
        name = _name;
    }

    function GET(string memory) public view returns (string memory) {
        return htmlContent;
    }

    function POST(bytes memory) public pure returns (string memory) {
        return "POST reqeusts not supported";
    }

    function updateContent(string memory newContent) external onlyOwner {
        htmlContent = newContent;
        emit ContentUpdated(owner, newContent);
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
