// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "./IHtml.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/*
 * Ownable HTML page. Can be governed by a single person, Multisig, DAO, etc.
 */
contract HtmlOwnable is IHtml, Ownable {
    string private html;

    // roughly 640gas/character
    constructor(string memory _html) Ownable(tx.origin) {
        html = _html;
    }

    // roughly 160gas/character (best case)
    function updateHtml(string memory _html) public onlyOwner {
        html = _html;
    }

    function GET(string memory) public view returns (string memory) {
        return html;
    }

    function POST(bytes memory) public pure returns (string memory) {
        return "POST reqeusts not supported";
    }
}
