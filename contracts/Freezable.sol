// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import "./ACL.sol";

error AccountHasBeenFrozen(address account);

contract Freezable is ACL {
    
    mapping(address => bool) public freezeAccounts;

    event Freeze(address account);
    event Unfreeze(address account);

    modifier notFrozen(address account) {
        if (freezeAccounts[account]) {
            revert AccountHasBeenFrozen(account);
        }
        _;
    }

    function freeze(address account) public onlyAdmin {
        freezeAccounts[account] = true;
        emit Freeze(account);
    }

    function unfreeze(address account) public onlyAdmin {
        freezeAccounts[account] = false;
        emit Unfreeze(account);
    }
}