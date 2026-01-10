<div align="center">

# **Wellcome to js-sdk**

![cover](./cover.svg)

</div>

<br/>

## Intro

This SDK is designed to work with the KLY network. Currently the functionality includes:

1) Generating key pairs for 4 types of accounts
2) Creation of all types of transactions
3) Interaction with smart contracts
4) Interaction with system components of the network (staking, aliases and much more)

## Note

Currently supports only <code>dev_tachyon</code> workflow


## Installation

```shell
pnpm add github:KlyntarNetwork/js-sdk
```


## Usage

### Requirements

- **Node.js only** (the SDK loads WASM/Go runtime for PQC features).
- **ESM** project (this package is published as ESM).

### Quick start

```js
import KlyntarSDK, { TX_TYPES, crypto } from 'js-sdk'

// Create client
const sdk = new KlyntarSDK({
  chainID: 'chain',
  workflowVersion: 1,
  nodeURL: 'http://127.0.0.1:7331',
})

// Generate ed25519 keypair
const kpJson = await crypto.ed25519.generateDefaultEd25519Keypair('', '', [44, 7337, 0, 0])
const { pub, prv } = JSON.parse(kpJson)

// Create and send a simple TX
const tx = sdk.createEd25519Transaction(
  TX_TYPES.TX,
  pub,
  prv,
  1,          // nonce
  0.01,       // fee (KLY)
  { to: 'SOME_RECIPIENT_ADDRESS', amount: 1 } // payload example
)

const result = await sdk.sendTransaction(tx)
console.log(result)
```

To fully understand the capabilities of the SDK, please refer to our [documentation](https://docs.klyntar.org/)