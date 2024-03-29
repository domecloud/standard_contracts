// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/extensions/AccessControlEnumerable.sol"; 
import "@openzeppelin/contracts/interfaces/IERC721.sol";

import "./ACL.sol";

contract NFT is ERC721URIStorage, ERC721Enumerable, ACL {

    event Memo(string memo);
    event Freeze(address account);
    event Unfreeze(address account);
    event SetPubliclyMintable(bool mintable);
    event SBTStatusSet(bool SBT);
    event Mint(address indexed to, uint256 tokenId, string uri);
    event Burn(uint256 tokenId);
    event SetTokenURI(uint256 tokenId, string uri);

    bool public isPubliclyMintable = false;
    bool public isSBT = false;
    mapping(address => bool) public freezeAccounts;

    uint256 private _tokenIds;

    bool internal locked;

    constructor() ERC721("My NFT", "NFT") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(BURNER_ROLE, msg.sender);
    }

    function setPubliclyMintable(bool mintable) public onlyAdmin {
        isPubliclyMintable = mintable;
        emit SetPubliclyMintable(mintable);
    }

    function setToSBT(bool SBT) public onlyAdmin {
        isSBT = SBT;
        emit SBTStatusSet(SBT);
    }

    function freeze(address account) public onlyAdmin {
        freezeAccounts[account] = true;
        emit Freeze(account);
    }

    function unfreeze(address account) public onlyAdmin {
        freezeAccounts[account] = false;
        emit Unfreeze(account);
    }

    function safeMint(address to, string memory uri) public returns (uint256) {
        bool isMinter = hasRole(MINTER_ROLE, msg.sender);
        require(isPubliclyMintable || isMinter, "This NFT is not publicly mintable");
        
        uint256 tokenId = _tokenIds;
        _tokenIds += 1;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);

        emit Mint(to, tokenId, uri);

        return tokenId;
    }

    function setTokenURI(uint256 tokenId, string memory uri) public onlyAdmin {
        _setTokenURI(tokenId, uri);
        emit SetTokenURI(tokenId, uri);
    }

    function burn(uint256 tokenId) public {
        require(!isSBT, "This NFT was not permitted to burn");
        require(freezeAccounts[msg.sender] != true, "Caller has been frozen");
        require(hasRole(BURNER_ROLE, msg.sender) || msg.sender == ownerOf(tokenId), "Caller does not own this NFT");
        _burn(tokenId);

        emit Burn(tokenId);
    }

    function transfer(address to, uint256 tokenId) public {
        transferFrom(msg.sender, to, tokenId);
    }

    function safeTransfer(address to, uint256 tokenId) public {
        safeTransferFrom(msg.sender, to, tokenId);
    }

    // overrides

    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public override(ERC721, IERC721) {
        require(!isSBT, "This NFT was not permitted to transfer");
        require(freezeAccounts[msg.sender] != true, "Caller has been frozen");

        super.transferFrom(from, to, tokenId);

    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory data
    ) public override(ERC721, IERC721) {
        require(!isSBT, "This NFT was not permitted to transfer");
        require(freezeAccounts[msg.sender] != true, "Caller has been frozen");
        
        super.safeTransferFrom(from, to, tokenId, data);

    }

    // The following functions are overrides required by Solidity.

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    )
        public
        view
        override(AccessControlEnumerable, ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _update(
        address to, 
        uint256 tokenId, 
        address auth
    ) 
        internal 
        override(ERC721, ERC721Enumerable) 
        returns (address) 
    {
        address from = super._update(to, tokenId, auth);
        require(freezeAccounts[from] != true, "Owner has been frozen");
        return from;
    }

    function _increaseBalance(
        address account, 
        uint128 amount
    ) 
        internal 
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, amount);
    }
}
