# NFT Smart Contract

## Introduction

This Solidity smart contract implements a non-fungible token (NFT) with extended functionality, including pausability, minting, burning, and address freezing. The contract leverages OpenZeppelin libraries for ERC-721, enumerable, and access control functionalities.

## Features

- ERC-721 NFT with additional features.
- Pausing and unpausing functionality.
- Minting and burning capabilities.
- Address freezing to prevent certain accounts from executing transactions.
- Publicly mintable and SBT (Single Burn Token) status control.

## Functions

### `setPubliclyMintable`

Control whether the NFT is publicly mintable.

```solidity
function setPubliclyMintable(bool mintable) public onlyAdmin
```

**Inputs:**
- `mintable`: Boolean indicating whether the NFT is publicly mintable.

**Outputs:**
None

### `setToSBT`

Set the NFT to SBT (Single Burn Token) status.

```solidity
function setToSBT(bool SBT) public onlyAdmin
```

**Inputs:**
- `SBT`: Boolean indicating whether the NFT is set to SBT.

**Outputs:**
None

### `freeze`

Freeze a specified account.

```solidity
function freeze(address account) public onlyAdmin
```

**Inputs:**
- `account`: Address to be frozen.

**Outputs:**
None

### `unfreeze`

Unfreeze a specified account.

```solidity
function unfreeze(address account) public onlyAdmin
```

**Inputs:**
- `account`: Address to be unfrozen.

**Outputs:**
None

### `safeMint`

Safely mint a new token and set its URI.

```solidity
function safeMint(address to, string memory uri) public returns (uint256)
```

**Inputs:**
- `to`: Address receiving the minted token.
- `uri`: URI associated with the minted token.

**Outputs:**
- `uint256`: ID of the minted token.

### `setTokenURI`

Set the URI for a specified token.

```solidity
function setTokenURI(uint256 tokenId, string memory uri) public onlyAdmin
```

**Inputs:**
- `tokenId`: ID of the token.
- `uri`: New URI to be set.

**Outputs:**
None

### `burn`

Burn a specified token.

```solidity
function burn(uint256 tokenId) public
```

**Inputs:**
- `tokenId`: ID of the token to be burned.

**Outputs:**
None

### `transfer`

Transfer a token between accounts.

```solidity
function transfer(address to, uint256 tokenId) public
```

**Inputs:**
- `to`: Address receiving the token.
- `tokenId`: ID of the token to be transferred.

**Outputs:**
None

### `safeTransfer`

Safely transfer a token between accounts.

```solidity
function safeTransfer(address to, uint256 tokenId) public
```

**Inputs:**
- `to`: Address receiving the token.
- `tokenId`: ID of the token to be transferred.

**Outputs:**
None

### `transferFrom`

Transfer a token from one account to another.

```solidity
function transferFrom(address from, address to, uint256 tokenId) public override
```

**Inputs:**
- `from`: Address from which the token is transferred.
- `to`: Address receiving the token.
- `tokenId`: ID of the token to be transferred.

**Outputs:**
None

### `safeTransferFrom`

Safely transfer a token from one account to another.

```solidity
function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data) public override
```

**Inputs:**
- `from`: Address from which the token is transferred.
- `to`: Address receiving the token.
- `tokenId`: ID of the token to be transferred.
- `data`: Additional data for the transfer.

**Outputs:**
None

### `tokenURI`

Get the URI for a specified token.

```solidity
function tokenURI(uint256 tokenId) public view override returns (string memory)
```

**Inputs:**
- `tokenId`: ID of the token.

**Outputs:**
- `string`: URI of the specified token.

## Events

### `Memo`

Emitted on memo events.

```solidity
event Memo(string memo)
```

**Fields:**
- `memo`: Additional information or memo.

### `Freeze`

Emitted when an account is frozen.

```solidity
event Freeze(address account)
```

**Fields:**
- `account`: Address that has been frozen.

### `Unfreeze`

Emitted when an account is unfrozen.

```solidity
event Unfreeze(address account)
```

**Fields:**
- `account`: Address that has been unfrozen.

### `SetPubliclyMintable`

Emitted when the publicly mintable status is set.

```solidity
event SetPubliclyMintable(bool mintable)
```

**Fields:**
- `mintable`: Boolean indicating whether the NFT is publicly mintable.

### `SBTStatusSet`

Emitted when the SBT status is set.

```solidity
event SBTStatusSet(bool SBT)
```

**Fields:**
- `SBT`: Boolean indicating whether the NFT is set to SBT.

### `Mint`

Emitted when a new token is minted.

```solidity
event Mint(address indexed to, uint256 tokenId, string uri)
```

**Fields:**
- `to`: Address receiving the minted token.
- `tokenId`: ID of the minted token.
- `uri`: URI associated with the minted token.

### `Burn`

Emitted when a token is burned.

```solidity
event Burn(uint256 tokenId)
```

**Fields:**
- `tokenId`: ID of the burned token.

### `SetTokenURI`

Emitted when the URI of a token is set.

```solidity
event SetTokenURI(uint256 tokenId, string uri)
```

**Fields:**
- `tokenId`: ID of the token.
- `uri`: New URI associated with the token.
