# ERC1155 NFT Smart Contract

## Introduction

This Solidity smart contract implements an ERC1155-compatible non-fungible token (NFT) with URI storage and extended functionality. The contract includes features such as pausability, minting, burning, address freezing, and batch operations. It utilizes OpenZeppelin's ERC1155URIStorage for URI management and AccessControl for role-based access control.

## Features

- ERC1155-compatible NFT with URI storage.
- Pausing and unpausing functionality.
- Minting and burning capabilities.
- Batch minting, burning, and transferring.
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

### `mint`

Mint a specific amount of tokens and set their URI.

```solidity
function mint(address account, uint256 id, uint256 amount, bytes memory data) public
```

**Inputs:**
- `account`: Address receiving the minted tokens.
- `id`: ID of the token to be minted.
- `amount`: Amount of tokens to be minted.
- `data`: Additional data for the minting.

**Outputs:**
None

### `mintBatch`

Mint a batch of tokens and set their URIs.

```solidity
function mintBatch(address account, uint256[] memory ids, uint256[] memory amounts, bytes memory data) public
```

**Inputs:**
- `account`: Address receiving the minted tokens.
- `ids`: Array of token IDs to be minted.
- `amounts`: Array of amounts of tokens to be minted.
- `data`: Additional data for the minting.

**Outputs:**
None

### `setTokenURI`

Set the URI for a specified token.

```solidity
function setTokenURI(uint256 id, string memory _tokenURI) public onlyAdmin
```

**Inputs:**
- `id`: ID of the token.
- `_tokenURI`: New URI to be set.

**Outputs:**
None

### `burn`

Burn a specific amount of tokens.

```solidity
function burn(address from, uint256 id, uint256 amount) public
```

**Inputs:**
- `from`: Address from which the tokens are burned.
- `id`: ID of the token to be burned.
- `amount`: Amount of tokens to be burned.

**Outputs:**
None

### `burnBatch`

Burn a batch of tokens.

```solidity
function burnBatch(address from, uint256[] memory ids, uint256[] memory amounts) public
```

**Inputs:**
- `from`: Address from which the tokens are burned.
- `ids`: Array of token IDs to be burned.
- `amounts`: Array of amounts of tokens to be burned.

**Outputs:**
None

### `safeTransfer`

Safely transfer a specific amount of tokens.

```solidity
function safeTransfer(address to, uint256 id, uint256 amount) public
```

**Inputs:**
- `to`: Address receiving the tokens.
- `id`: ID of the token to be transferred.
- `amount`: Amount of tokens to be transferred.

**Outputs:**
None

### `safeBatchTransfer`

Safely transfer a batch of tokens.

```solidity
function safeBatchTransfer(address to, uint256[] memory ids, uint256[] memory amounts) public
```

**Inputs:**
- `to`: Address receiving the tokens.
- `ids`: Array of token IDs to be transferred.
- `amounts`: Array of amounts of tokens to be transferred.

**Outputs:**
None

### `uri`

Get the URI for a specified token.

```solidity
function uri(uint256 tokenId) public view override returns (string memory)
```

**Inputs:**
- `tokenId`: ID of the token.

**Outputs:**
- `string`: URI of the specified token.