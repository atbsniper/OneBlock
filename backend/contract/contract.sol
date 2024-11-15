// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LogGard is ERC721, ERC721URIStorage, ERC721Pausable, Ownable {
    uint256 public _nextLogId;

struct Log {
    uint256 tokenId;
    string uri;
}
    constructor(address initialOwner)
        ERC721("LogGard", "LG")
        Ownable(initialOwner)
    {}

    event LogUploaded(uint256 indexed tokenId, address indexed owner, string log);

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

function uploadLog(address to,string memory log) public onlyOwner returns (uint256) {
    uint256 tokenId = _nextLogId++;
    _safeMint(msg.sender, tokenId);
    _setTokenURI(tokenId, log);
    emit LogUploaded(tokenId, msg.sender, log); // Emit event with tokenId and log
    return tokenId;
}


    // The following functions are overrides required by Solidity.

    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Pausable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

function getLogs() public view returns (Log[] memory) {
    Log[] memory logList = new Log[](_nextLogId);
    for (uint256 i = 0; i < _nextLogId; i++) {
        logList[i] = Log(i, tokenURI(i));
    }
    return logList;
}

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}