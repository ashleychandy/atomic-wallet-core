# Wallet Core ⛓️

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

A modular TypeScript/JavaScript framework for blockchain integrations. Supports **Bitcoin**, **Ethereum**, **Cosmos**, **Ontology**, and many other networks through extendable adapters.

## Features

- 🧩 Unified interface for coins, tokens, and transactions
- 🔍 Built-in blockchain explorers
- 📦 Custom token support (ERC-20, BEP-20, etc.)


## Requirements

```
node =18
yarn >=1.22
```

## Core Concepts

| Component                                                                                             | Description                                    |
|-------------------------------------------------------------------------------------------------------| ---------------------------------------------- |
| [AbstractWallet](https://github.com/Atomicwallet/wallet-core/blob/main/src/abstract/abstractWallet.ts) | Base class for all blockchain entities         |
| [Coin](https://github.com/Atomicwallet/wallet-core/blob/main/src/abstract/coin.ts)           | Native currency implementation (BTC/ETH)       |
| [Token](https://github.com/Atomicwallet/wallet-core/blob/main/src/abstract/token.ts)         | Token standard implementation (ERC-20)         |
| [Explorer](https://github.com/Atomicwallet/wallet-core/blob/main/src/explorers/explorer.js)  | API Implementation to interact with blockchain |

## Usage Examples

### Wallet

```typescript
import { BTCCoin } from 'wallet-core';

// Initialize wallet
const wallet = new BTCCoin({
  ticker: 'BTC',
  network: 'mainnet',
  feePerByte: 5 // sat/byte
});

await wallet.loadWallet(mnemonic);

// Create raw tx
const rawTx = await wallet.createTransaction({
  address: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
  amount: '0.015'
});

// Submit
const txId = await wallet.sendTransaction(rawTx);
```

### Token

The Token class extends AbstractWallet and represents a token on a blockchain. It relies on a parent Coin instance for transaction creation and balance management.

```typescript
import { ETHCoin } from 'wallet-core';

// Initialize parent wallet
const ethWallet = new ETHCoin({ ...params })

await ethWallet.loadWallet(mnemonic);

// create Token instance
const dai = ethWallet.createToken({ ...tokenParams});

// create raw tx
const tx = await dai.createTransaction({
  address: '0x89205...',
  amount: '50.0'
});

// submit
const txid = await ethWallet.sendTransaction(tx)
```

### Explorer Integration

The Explorer class is used to interact with blockchain explorers. It provides methods for fetching transaction data, balances, and other blockchain-related information.

```typescript
import { InsigthExplorer } from 'wallet-core'

// Initialize explorer 
const explorer = new InsigthExplorer({
  baseUrl: 'https://api.blockchain.info',
  txWebUrl: 'https://blockchain.info/tx/'
});

// Fetch tx
const tx = await explorer.getTransaction(txid);
```

## CLI

The CLI supports several commands for interacting with wallet-core.
Below is a breakdown of available commands:

To use CLI run:
```bash
ts-node ./src/cli <command> [options]
```

To see help information:

```bash
ts-node ./src/cli --help
```

## Commands

`mnemonic` -
Generates a new mnemonic phrase or restores an existing one.

**Options:**

* `-p, --phrase <phrase>` Generate mnemonic from an existing phrase.

**Example:**
```bash
ts-node ./src/cli mnemonic
```

To restore from an existing phrase:

```bash
ts-node ./src/cli mnemonic --phrase "middle derive ... original dawn"
```
---
`keys` - Generates key pairs for supported wallets.

**Options:**

* `-p, --phrase <phrase>` Generate key pairs using a mnemonic phrase.

**Example:**
```bash
ts-node ./src/cli keys
```

To use an existing mnemonic:
```bash
ts-node ./src/cli keys --phrase "middle derive ... original dawn"
```
---
`tx` - Creates a signed transaction.

**Options:**

* `-p, --phrase <phrase>` Generate key pairs from a mnemonic phrase.
* `-w, --wallet <wallet>` The wallet/ticker to use, e.g., BTC.
* `-a, --amount <amount>` The transaction amount, e.g., 1.35.
* `-r, --recipient <recipient>` The recipient's address.
* `-m, --memo <memo> (optional)` Additional memo information.

**Example:**
```bash
ts-node ./src/cli tx --wallet BTC --amount 1.35 --recipient 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa
```

To include a memo:

```bash
ts-node ./src/cli tx --wallet BTC --amount 1.35 --recipient 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa --memo "Test transaction"
```
---
`submitTx` - Submits a signed transaction to the blockchain.

**Options:**

* `-p, --phrase <phrase>` Generate key pairs from a mnemonic phrase.
* `-w, --wallet <wallet>` The wallet/ticker to use, e.g., BTC.
* `-t, --tx <tx>` The signed transaction hex, binary, or object.
Example:
 
```bash
ts-node ./src/cli submitTx --wallet BTC --phrase "middle derive ... original dawn" --tx "<signed_transaction_hex>"
```

# Contribution

 **Contribution guides:**                                                                                   
* [Adapter](https://github.com/Atomicwallet/wallet-core/blob/main/docs/adapter_contrib.md) 
