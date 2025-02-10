// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./IHtml.sol";

contract HtmlPage is IHtml {
    address public owner;
    string private htmlContent;

    event ContentUpdated(address indexed owner, string newContent);

    constructor(string memory initialContent) {
        owner = tx.origin;
        htmlContent = initialContent;
    }

    function GET(string memory) public view returns (string memory) {
        return htmlContent;
    }

    function POST(bytes memory) public pure returns (string memory) {
        return "POST reqeusts not supported";
    }

    function getContent() external view returns (string memory) {
        return htmlContent;
    }

    function updateContent(string memory newContent) external onlyOwner {
        htmlContent = newContent;
        emit ContentUpdated(owner, newContent);
    }

    modifier onlyOwner() {
        require(tx.origin == owner, "Not the owner");
        _;
    }
}
