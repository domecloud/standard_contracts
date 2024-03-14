# Token Smart Contract

## Introduction

This Solidity smart contract implements a customizable ERC-20 token with additional features such as pausability, minting, burning, and address freezing. The contract leverages OpenZeppelin libraries for ERC-20, permit, and access control functionalities.

## Features

- ERC-20 token with additional features.
- Pausing and unpausing functionality.
- Minting and burning capabilities.
- Address freezing to prevent certain accounts from executing transactions.

## Functions

### `pause` and `unpause`

Pauses and unpauses token transfers.

```solidity
function pause() public onlyPauser
```

**Inputs:**
None

**Outputs:**
None

```solidity
function unpause() public onlyPauser
```

**Inputs:**
None

**Outputs:**
None

### `freeze` and `unfreeze`

Freezes and unfreezes a specified account.

```solidity
function freeze(address account) public onlyAdmin
```

**Inputs:**
- `account`: Address to be frozen.

**Outputs:**
None

```solidity
function unfreeze(address account) public onlyAdmin
```

**Inputs:**
- `account`: Address to be unfrozen.

**Outputs:**
None

### `mint` and `mintTo`

Mints new tokens.

```solidity
function mint(uint256 amount) public onlyMinter
```

**Inputs:**
- `amount`: Amount of tokens to be minted.

**Outputs:**
None

```solidity
function mintTo(address to, uint256 amount) public onlyMinter
```

**Inputs:**
- `to`: Address receiving the minted tokens.
- `amount`: Amount of tokens to be minted.

**Outputs:**
None

### `burn` and `burnFrom`

Burns tokens from the caller's balance or from a specified account.

```solidity
function burn(uint256 amount) public
```

**Inputs:**
- `amount`: Amount of tokens to be burned.

**Outputs:**
None

```solidity
function burnFrom(address from, uint256 amount) public
```

**Inputs:**
- `from`: Address from which tokens will be burned.
- `amount`: Amount of tokens to be burned.

**Outputs:**
None

### `transfer` and `transferFrom`

Transfers tokens between accounts with optional memo.

```solidity
function transfer(address to, uint256 amount) public override returns (bool)
```

**Inputs:**
- `to`: Address receiving the tokens.
- `amount`: Amount of tokens to be transferred.

**Outputs:**
- `bool`: Success status of the transfer.

```solidity
function transfer(address to, uint256 amount, string memory memo) public
```

**Inputs:**
- `to`: Address receiving the tokens.
- `amount`: Amount of tokens to be transferred.
- `memo`: Memo or additional information.

**Outputs:**
None

```solidity
function transferFrom(address from, address to, uint256 amount) public override returns (bool)
```

**Inputs:**
- `from`: Address from which tokens will be transferred.
- `to`: Address receiving the tokens.
- `amount`: Amount of tokens to be transferred.

**Outputs:**
- `bool`: Success status of the transfer.

```solidity
function transferFrom(address from, address to, uint256 amount, string memory memo) public
```

**Inputs:**
- `from`: Address from which tokens will be transferred.
- `to`: Address receiving the tokens.
- `amount`: Amount of tokens to be transferred.
- `memo`: Memo or additional information.

**Outputs:**
None

### `totalMintAmount`, `totalBurnAmount`, `totalTransferedAmount`

Public variables to track the total minted, burned, and transferred amounts.

**Inputs:**
None

**Outputs:**
- `uint256`: Total minted, burned, or transferred amount.

## Events

### `Memo`, `Freeze`, `Unfreeze`, `Mint`, `Burn`

Emitted on specific events.

```solidity
event Memo(string memo)
```

**Fields:**
- `memo`: Additional information or memo.

```solidity
event Freeze(address account)
```

**Fields:**
- `account`: Address that has been frozen.

```solidity
event Unfreeze(address account)
```

**Fields:**
- `account`: Address that has been unfrozen.

```solidity
event Mint(address indexed to, uint256 amount)
```

**Fields:**
- `to`: Address receiving the minted tokens.
- `amount`: Amount of tokens minted.

```solidity
event Burn(address indexed from, uint256 amount)
```

**Fields:**
- `from`: Address from which tokens have been burned.
- `amount`: Amount of tokens burned.
