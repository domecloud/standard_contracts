// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "./Token.sol";

contract TokenCapped is Token, ERC20Capped {

    constructor(uint256 cap_) ERC20Capped(cap_) {}

    function _update(address from, address to, uint256 value) internal 
        override(Token, ERC20Capped) 
        whenNotPaused 
        notFrozen(from)    
    {
        ERC20Capped._update(from, to, value);
    }

    function transfer(address to, uint256 amount) public 
        override(ERC20, Token) 
        returns (bool) 
    {        
        return Token.transfer(to, amount);
    }

    function transferFrom(address from, address to, uint256 amount) public 
        override(ERC20, Token) 
        returns (bool) 
    {
        return Token.transferFrom(from, to, amount);
    }
}