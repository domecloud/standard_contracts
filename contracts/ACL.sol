// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import "@openzeppelin/contracts/access/extensions/AccessControlEnumerable.sol";

contract ACL is AccessControlEnumerable {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    event AdminGranted(address indexed admin);
    event AdminRevoked(address indexed admin);
    event MinterGranted(address indexed minter);
    event MinterRevoked(address indexed minter);
    event BurnerGranted(address indexed burner);
    event BurnerRevoked(address indexed burner);
    event PauserGranted(address indexed pauser);
    event PauserRevoked(address indexed pauser);

    modifier onlyAdmin() {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, msg.sender),
            "Caller does not has a DEFAULT_ADMIN_ROLE"
        );
        _;
    }

    modifier onlyMinter() {
        require(
            hasRole(MINTER_ROLE, msg.sender),
            "Caller does not has a MINTER_ROLE"
        );
        _;
    }

    modifier onlyBurner() {
        require(
            hasRole(BURNER_ROLE, msg.sender),
            "Caller does not has a BURNER_ROLE"
        );
        _;
    }

    modifier onlyPauser() {
        require(
            hasRole(PAUSER_ROLE, msg.sender),
            "Caller does not has a PAUSER_ROLE"
        );
        _;
    }

    function grantAdmin(address admin) external onlyAdmin {
        grantRole(DEFAULT_ADMIN_ROLE, admin);
        emit AdminGranted(admin);
    }

    function revokeAdmin(address admin) external onlyAdmin {
        revokeRole(DEFAULT_ADMIN_ROLE, admin);
        emit AdminRevoked(admin);
    }

    function grantMinter(address minter) external onlyAdmin {
        grantRole(MINTER_ROLE, minter);
        emit MinterGranted(minter);
    }

    function revokeMinter(address minter) external onlyAdmin {
        revokeRole(MINTER_ROLE, minter);
        emit MinterRevoked(minter);
    }

    function grantBurner(address burner) external onlyAdmin {
        grantRole(BURNER_ROLE, burner);
        emit BurnerGranted(burner);
    }

    function revokeBurner(address burner) external onlyAdmin {
        revokeRole(BURNER_ROLE, burner);
        emit BurnerRevoked(burner);
    }

    function grantPauser(address pauser) external onlyAdmin {
        grantRole(PAUSER_ROLE, pauser);
        emit PauserGranted(pauser);
    }

    function revokePauser(address pauser) external onlyAdmin {
        revokeRole(PAUSER_ROLE, pauser);
        emit PauserRevoked(pauser);
    }
}