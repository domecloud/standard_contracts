// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";

import "./ACL.sol";
import "./Freezable.sol";

contract NFT2 is ERC1155URIStorage, ACL, Freezable {
    
    event Memo(string memo);
    event SetPubliclyMintable(bool mintable);
    event SBTStatusSet(bool SBT);
    event Mint(address indexed to, uint256 tokenId, uint256 amount, string uri);
    event Burn(uint256 tokenId);
    event SetTokenURI(uint256 tokenId, string uri);

    bool public isPubliclyMintable = false;
    bool public isSBT = false;

    constructor() ERC1155("") {
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

    function mint(address account, uint256 id, uint256 amount, bytes memory data)  public {
        require(isPubliclyMintable || hasRole(MINTER_ROLE, msg.sender), "This NFT is not publicly mintable");
        _mint(account, id, amount, data);

        emit Mint(account, id, amount, uri(id));
    }

    function mintBatch(address account, uint256[] memory ids, uint256[] memory amounts, bytes memory data)  public {
        require(isPubliclyMintable || hasRole(MINTER_ROLE, msg.sender), "This NFT is not publicly mintable");
        _mintBatch(account, ids, amounts, data);

        for (uint256 i = 0; i < ids.length; i++) {
            emit Mint(account, ids[i], amounts[i], uri(ids[i]));
        }
    }

    function setTokenURI(uint256 id, string memory _tokenURI) public onlyAdmin {
        _setURI(id, _tokenURI);
        emit SetTokenURI(id, _tokenURI);
    }

    function burn(address from, uint256 id, uint256 amount) public {
        require(!isSBT, "This NFT was not permitted to burn");
        if (msg.sender == from && freezeAccounts[msg.sender]) {
            revert AccountHasBeenFrozen(msg.sender);
        } else if (msg.sender != from) {
            require(hasRole(BURNER_ROLE, msg.sender), "Caller does not own this NFT");
        }
        _burn(from, id, amount);
        emit Burn(id);
    }

    function burnBatch(address from, uint256[] memory ids, uint256[] memory amounts) public {
        require(!isSBT, "This NFT was not permitted to burn");
        if (msg.sender == from && freezeAccounts[msg.sender]) {
            revert AccountHasBeenFrozen(msg.sender);
        } else if (msg.sender != from) {
            require(hasRole(BURNER_ROLE, msg.sender), "Caller does not own this NFT");
        }
        _burnBatch(from, ids, amounts);
        for (uint256 i = 0; i < ids.length; i++) {
            emit Burn(ids[i]);
        }
    }

    function safeTransfer(address to, uint256 id, uint256 amount) public {
        require(!isSBT, "This NFT was not permitted to transfer");
        safeTransferFrom(msg.sender, to, id, amount, "");
    }

    function safeTransferFrom(address from, address to, uint256 id, uint256 amount) public {
        require(!isSBT, "This NFT was not permitted to transfer");
        safeTransferFrom(from, to, id, amount, "");
    }

    function safeBatchTransfer(address to, uint256[] memory ids, uint256[] memory amounts) public {
        require(!isSBT, "This NFT was not permitted to transfer");
        safeBatchTransferFrom(msg.sender, to, ids, amounts, "");
    }

    // The following functions are overrides required by Solidity.

    function _update(
        address from, 
        address to, 
        uint256[] memory ids, 
        uint256[] memory values
    ) internal override 
        notFrozen(from)
    {
        super._update(from, to, ids, values);
    }

    function uri(
        uint256 tokenId
    ) public view override(ERC1155URIStorage) returns (string memory) {
        return super.uri(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    )
        public
        view
        override(ERC1155, AccessControlEnumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}