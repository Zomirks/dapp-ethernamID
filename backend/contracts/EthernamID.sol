// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract EthernamID is ERC721, Ownable {
    uint256 private _nextTokenId;
  
    /**
     * @dev Smart Contract Constructor
     * @param initialOwner Smart Contract Owner
     */
    constructor(address initialOwner)
        ERC721("Ethernam ID", "EID")
        Ownable(initialOwner)
        {

    }
    
    /**
     * @dev message sender can mint
     * @param to Address to receive the NFT
     */
    function safeMint(address to) external {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
    }
}
