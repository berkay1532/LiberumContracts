// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

interface IHtml {
    function GET(string memory path) external view returns (string memory);

    function POST(bytes memory payload) external returns (string memory);
}
