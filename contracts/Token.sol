// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

import "./ACL.sol";
import "./Freezable.sol";

contract Token is ERC20, ERC20Burnable, Pausable, ACL, ERC20Permit, Freezable {

    uint256 public totalMintAmount = 0;
    uint256 public totalBurnAmount = 0;
    uint256 public totalTransferedAmount = 0;
    
    event Memo(string memo);
    event Mint(address indexed to, uint256 amount);
    event Burn(address indexed from, uint256 amount);
        
    constructor() ERC20("Token", "TKN") ERC20Permit("TKN") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(BURNER_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
    }

    function pause() public onlyPauser {
        _pause();
    }

    function unpause() public onlyPauser {
        _unpause();
    }

    function mint(uint256 amount) public onlyMinter {
        _mint(msg.sender, amount);
        totalMintAmount += amount;
        emit Mint(msg.sender, amount);
    }

    function mintTo(address to, uint256 amount) public onlyMinter {
        _mint(to, amount);
        totalMintAmount += amount;
        emit Mint(to, amount);
    }

    function burn(uint256 amount) public override(ERC20Burnable)         
        notFrozen(msg.sender)
    {
        _burn(msg.sender, amount);
        totalBurnAmount += amount;
        emit Burn(msg.sender, amount);
    }

    function burnFrom(address from, uint256 amount) public override(ERC20Burnable)
    {
        if (msg.sender == from && freezeAccounts[msg.sender]) {
            revert AccountHasBeenFrozen(msg.sender);
        } else if (msg.sender != from) {
            require(hasRole(BURNER_ROLE, msg.sender), "Caller does not has a BURNER_ROLE");
        }
        _burn(from, amount);
        totalBurnAmount += amount;
        emit Burn(from, amount);
    }

    function transfer(address to, uint256 amount) public override
        notFrozen(msg.sender)          
        returns (bool) 
    {
        address owner = _msgSender();
        _transfer(owner, to, amount);
        totalTransferedAmount += amount;

        return true;
    }

    function transfer(address to, uint256 amount, string memory memo) public 
        notFrozen(msg.sender) 
    {
        if (transfer(to, amount)) {
            totalTransferedAmount += amount;
            if (bytes(memo).length > 0) {
                emit Memo(memo);
            }
        }
    }

    function transferFrom(address from, address to, uint256 amount, string memory memo) public 
        notFrozen(msg.sender) 
    {
        if (transferFrom(from, to, amount)) {
            totalTransferedAmount += amount;
            if (bytes(memo).length > 0) {
                emit Memo(memo);
            }
        }
    }

    function transferFrom(address from, address to, uint256 amount) public override
        notFrozen(msg.sender)  
        returns (bool) 
    {
        totalTransferedAmount += amount;
        return super.transferFrom(from, to, amount);
    }

    // The following functions are overrides required by Solidity.

    function _update(address from, address to, uint256 value) internal override
        whenNotPaused 
        notFrozen(from) 
    {
        super._update(from, to, value);
    }
}
