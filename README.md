<div align="center">
  <a href="https://vuejs.org/"><img width="200" height="200" hspace="10" src="https://camo.githubusercontent.com/0b17e5a01574a2c1251b51c910c422f6ca6cb968a52686a770b668a634792c09/68747470733a2f2f7675656a732e6f72672f696d616765732f6c6f676f2e706e67" alt="vite logo" /></a>
  <a href="https://docs.walletconnect.com/web3modal/v2/about"><img width="200" height="200" hspace="10" src="https://docs.walletconnect.com/img/walletconnect-logo-black.svg" alt="vite logo" /></a>
</div>

<h1 align="center">Vue web3 auth</h1>

<p align="center">Web3 authentication for Vue3 apps based on <a href="https://github.com/WalletConnect/web3modal/tree/V2">WalletConnect Web3Modal v2</a> and wagmi</p>

<div align="center">
  <img src="https://img.shields.io/npm/dependency-version/%40kolirt%2Fvue-web3-auth/peer/vue" alt="vue-version" />
  
  <img src="https://img.shields.io/bundlephobia/minzip/%40kolirt%2Fvue-web3-auth" alt="npm bundle size"/>
  
  <a href="https://www.npmjs.com/package/@kolirt/vue-web3-auth" target="_blank">
    <img src="https://img.shields.io/npm/v/%40kolirt%2Fvue-web3-auth" alt="npm-version" /></a>

  <img src="https://img.shields.io/npm/l/vite-plugin-robots" alt="licence" />
</div>

<p align="center">
  <img src="https://img.shields.io/static/v1?label=Made%20with&message=VueJS&color=limegreen&style=for-the-badge&logo=vue.js" />
  <img src="https://img.shields.io/badge/Made%20for-Dapps-orange?style=for-the-badge&logo=ethereum" />
</p>

Simple WalletConnect Web3Modal v2 integration package for Vue3 apps.

### Versions

| package version                                          | web3modal                                                |
| -------------------------------------------------------- | -------------------------------------------------------- |
| [2.x.x](https://github.com/kolirt/vue-web3-auth/tree/v2) | [v2](https://github.com/WalletConnect/web3modal/tree/V2) |

### Table of Contents

- [Versions](#versions)
- [Getting started](#getting-started)
  - [Installation](#installation)
  - [Setup](#setup)
    - [Configuration](#configuration)
    - [Custom chain](#custom-chain)
    - [Custom rpc provider](#custom-rpc-provider)
- [Usage](#usage)
  - [Basic usage](#basic-usage) 
    - [Info about the user's connected wallet and wallet type](#info-about-the-users-connected-wallet-and-wallet-type)
    - [Connect wallet button](#connect-wallet-button)
    - [Switch chain](#switch-chain)
    - [Select chain via Web3Modal](#select-chain-via-web3modal)
    - [FetchGasPrice](#fetchgasprice)
    - [FetchBlockNumber](#fetchblocknumber)
    - [FetchTransaction](#fetchtransaction)
    - [FetchTransactionReceipt](#fetchtransactionreceipt)
    - [PrepareSendTransaction](#preparesendtransaction)
    - [SendTransaction](#sendtransaction)
    - [WaitForTransaction](#waitfortransaction)
    - [SignMessage](#signmessage)
    - [Multicall](#multicall)
    - [FetchBalance](#fetchbalance)
    - [FetchToken](#fetchtoken)
    - [ReadContract](#readcontract)
    - [WriteContract](#writecontract)
    - [EstimateWriteContractGas](#estimatewritecontractgas)
    - [ParseEvents](#parseevents)
    - [WatchContractEvent](#watchcontractevent)
    - [WatchAsset](#watchasset)
  - [Composable](#composable)
    - [UseFetchBalance](#usefetchbalance)
- [Demo](#demo)
- [Example](#example)
- [Faq](#faq)
- [License](#license)
- [Other packages](#other-packages)

<a href="https://www.buymeacoffee.com/kolirt" target="_blank">
  <img src="https://cdn.buymeacoffee.com/buttons/v2/arial-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" >
</a>

# Getting started

## Installation

Use yarn or npm to install the package `@kolirt/vue-web3-auth`.

```bash
npm install --save @kolirt/vue-web3-auth

yarn add @kolirt/vue-web3-auth
```

## Setup

### Configuration

Add dependencies to your `main.js`:

```javascript
import { createApp } from 'vue'
import { Chains, createWeb3Auth } from '@kolirt/vue-web3-auth'

const app = createApp({...})

app.use(createWeb3Auth({
  projectId: '', // generate here https://cloud.walletconnect.com/ and turn on 'Supports Sign v2'
  chains: [
    Chains.bsc,
    Chains.mainnet,
    Chains.polygon
  ]
}))

app.mount('#app')
```

### Custom chain

```ts
import { type Chain } from '@kolirt/vue-web3-auth'

const bsc: Chain = {
  id: 56,
  name: 'BNB Smart Chain',
  network: 'bsc',
  nativeCurrency: {
    decimals: 18,
    name: 'BNB',
    symbol: 'BNB'
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.ankr.com/bsc'],
      webSocket: ['wss://bsc-ws-node.nariox.org:443']
    },
    public: {
      http: ['https://rpc.ankr.com/bsc'],
      webSocket: ['wss://bsc-ws-node.nariox.org:443']
    }
  },
  blockExplorers: {
    etherscan: {
      name: 'BscScan',
      url: 'https://bscscan.com'
    },
    default: {
      name: 'BscScan',
      url: 'https://bscscan.com'
    }
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 15921452
    }
  }
}
```

### Custom rpc provider

By default, the package uses the walletconnect rpc provider. If you want to use a custom rpc from the chain, you can set the `enableCustomProvider` option to `true`.

```ts
app.use(createWeb3Auth({
  enableCustomProvider: true
})
```

# Usage

## Basic usage

### Info about the user's connected wallet and wallet type

```ts
import { account } from '@kolirt/vue-web3-auth'

account.connected // if connected
account.address // current account address
account.shortAddress // current account address with 3 dots
account.wallet.id // current wallet id
account.wallet.name // current wallet name
```

### Connect wallet button

```vue
<script setup lang="ts">
import { account, accountDetails, connect, disconnect } from '@kolirt/vue-web3-auth'
</script>

<template>
  <div v-if="account.connected">
    <button @click="accountDetails()">
      {{ account.address }}
    </button>
    <button @click="disconnect()">Disconnect from {{ account.wallet.name }}</button>
  </div>
  <button v-else @click="connect()">Connect wallet</button>
</template>
```````

### Switch chain
To switch the chain, you need to add it during [configuration](#configuration). 

```vue
<script setup lang="ts">
import { switchChain, Chains } from '@kolirt/vue-web3-auth'
</script>

<template>
  <button @click="switchChain(Chains.polygon)">Switch to polygon</button>
</template>
```

### Select chain via Web3Modal

```vue
<script setup lang="ts">
import { selectChain } from '@kolirt/vue-web3-auth'
</script>

<template>
  <button @click="selectChain">Select chain</button>
</template>
```

### FetchGasPrice

```ts
import { fetchGasPrice } from '@kolirt/vue-web3-auth'

const data = await fetchGasPrice()

/**
 * Result in data
 *
 * {
 *  formatted: {
 *   gasPrice: '3'
 *  },
 *  gasPrice: 3000000000n
 * }
 */
```

### FetchBlockNumber

```ts
import { fetchBlockNumber } from '@kolirt/vue-web3-auth'

const data = await fetchBlockNumber()

/**
 * Result in data
 *
 * 29288229n
 */
```

### FetchTransaction

```ts
import { fetchTransaction } from '@kolirt/vue-web3-auth'

const transaction = await fetchTransaction({
  hash: '0x7ed8dc64f54ae43f4d53173e95aa929c52de44ec5cea8c28246989914ed7f4fb'
})
```

### FetchTransactionReceipt

```ts
import { fetchTransactionReceipt } from '@kolirt/vue-web3-auth'

const transactionReceipt = await fetchTransactionReceipt({
  hash: '0x7ed8dc64f54ae43f4d53173e95aa929c52de44ec5cea8c28246989914ed7f4fb'
})
```

### PrepareSendTransaction

```ts
import { prepareSendTransaction } from '@kolirt/vue-web3-auth'

const preparedTxn = await prepareSendTransaction({
  to: '0x2D4C407BBe49438ED859fe965b140dcF1aaB71a9',
  value: 1n
})
```

### SendTransaction

```ts
import { sendTransaction } from '@kolirt/vue-web3-auth'

const txn = await sendTransaction({
  to: '0x2D4C407BBe49438ED859fe965b140dcF1aaB71a9',
  value: 1n
})
```

### WaitForTransaction

```ts
import { waitForTransaction } from '@kolirt/vue-web3-auth'

const transactionReceipt = await waitForTransaction({
  hash: '0x7ed8dc64f54ae43f4d53173e95aa929c52de44ec5cea8c28246989914ed7f4fb',
})
```

### SignMessage

```ts
import { signMessage } from '@kolirt/vue-web3-auth'

const signature = await signMessage('test message')
```

### Multicall

```ts
import { chain, multicall, multicallABI } from '@kolirt/vue-web3-auth'

let data = await multicall({
  calls: [
    {
      abi: multicallABI,
      contractAddress: chain.value.contracts.multicall3.address,
      calls: [
        ['getEthBalance', ['0x2D4C407BBe49438ED859fe965b140dcF1aaB71a9']],
        ['getEthBalance', ['0x295e26495CEF6F69dFA69911d9D8e4F3bBadB89B']],
        ['getEthBalance', ['0x2465176C461AfB316ebc773C61fAEe85A6515DAA']]
      ]
    }
  ]
})

/**
 * Result in data
 *
 * [
 *  {result: 1908669631824871303n, status: "success"},
 *  {result: 133515691552422277n, status: "success"},
 *  {result: 2080909582708869960n, status: "success"}
 * ]
 */
```

### FetchBalance

```ts
import { fetchBalance } from '@kolirt/vue-web3-auth'

let bnbBalance = await fetchBalance({
  address: '0x2D4C407BBe49438ED859fe965b140dcF1aaB71a9'
})

/**
 * Result in bnbBalance
 *
 * {
 *  decimals: 18,
 *  formatted: '1.908669631824871303',
 *  symbol: 'BNB',
 *  value: 1908669631824871303n
 * }
 */

let tokenBalance = await fetchBalance({
  address: '0x2D4C407BBe49438ED859fe965b140dcF1aaB71a9',
  token: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'
})

/**
 * Result in tokenBalance
 *
 * {
 *  decimals: 18,
 *  formatted: '0',
 *  symbol: 'WBNB',
 *  value: 0n
 * }
 */
```

### FetchToken

```ts
import { fetchToken } from '@kolirt/vue-web3-auth'

let data = await fetchToken({
  address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'
})

/**
 * Result in data
 *
 * {
 *  address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
 *  decimals: 18,
 *  name: 'Wrapped BNB',
 *  symbol: 'WBNB',
 *  totalSupply: {
 *   formatted: '2538454.736169014001284694',
 *   value: 2538454736169014001284694n
 *  }
 * }
 */
```

### ReadContract

```ts
import { erc20ABI, readContract } from '@kolirt/vue-web3-auth'

let data = await readContract({
  address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', // wbnb on bsc
  abi: erc20ABI,
  functionName: 'balanceOf',
  args: ['0x36696169c63e42cd08ce11f5deebbcebae652050']
})

/**
 * Result in data
 *
 * 107109316688516684525777n
 */
```

### WriteContract

```ts
import { erc20ABI, writeContract } from '@kolirt/vue-web3-auth'

await writeContract({
  abi: erc20ABI,
  address: '0x55d398326f99059fF775485246999027B3197955',
  functionName: 'approve',
  args: ['0x685B1ded8013785d6623CC18D214320b6Bb64759', 100]
}).then(async (data) => {
  console.log('hash', data.hash)

  await data.wait()

  console.log('transaction successfully')
})
```

### EstimateWriteContractGas

```ts
import { erc20ABI, estimateWriteContractGas } from '@kolirt/vue-web3-auth'

const gas = await estimateWriteContractGas({
  abi: erc20ABI,
  address: '0x55d398326f99059fF775485246999027B3197955',
  functionName: 'approve',
  args: ['0x685B1ded8013785d6623CC18D214320b6Bb64759', 100]
}).catch((e) => {})
```

### ParseEvents

```ts
import { erc20ABI, fetchTransactionReceipt, parseEvents } from '@kolirt/vue-web3-auth'

const transactionReceipt = await fetchTransactionReceipt({
  hash: '0x2a328737e94bb243b1ff64792ae68cd6c179797dc1de1e092c96137f0d3404c3'
})

const events = parseEvents({ abi: erc20ABI }, transactionReceipt)
/**
 * Result in events
 *
 * [
 *  {
 *   args: {
 *    owner: '0xaA916B4a4cDbEFC045fa24542673F500a11F5413',
 *    spender: '0x023963f7e755bE4F743047183d1F49C31E84AEa4',
 *    value: 1000000000000000000n
 *   },
 *   eventName: 'Approval'
 *  }
 * ]
 */
```

### WatchContractEvent

```ts
import { erc20ABI, watchContractEvent } from '@kolirt/vue-web3-auth'

const unwatch = watchContractEvent(
  {
    address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    abi: erc20ABI,
    eventName: 'Transfer'
  },
  (log) => {
    console.log(log)
  }
)
```

### WatchAsset

```ts
import { watchAsset } from '@kolirt/vue-web3-auth'

const result = watchAsset({
  address: '0x6b175474e89094c44da98b954eedeac495271d0f',
  decimals: 18,
  symbol: 'DAI'
})
```

## Composable

### UseFetchBalance

```ts
import { useFetchBalance } from '@kolirt/vue-web3-auth'

// use `fetch` for manual init when `disableAutoFetch` is `true`
const { loaded, fetching, data, fetch, reload, disableAutoReload } = useFetchBalance(
  {
    address: '0x2D4C407BBe49438ED859fe965b140dcF1aaB71a9'
  },
  {
    disableAutoFetch: false,
    autoReloadTime: 30000,
    disableAutoReload: false
  }
)
```

# Demo

[Demo here](https://kolirt.github.io/vue-web3-auth/).

# Example

[Example here](https://github.com/kolirt/vue-web3-auth/tree/v2/examples).

# FAQ

Check closed [issues](https://github.com/kolirt/vue-web3-auth/issues) to get answers for most asked questions.

# License

[MIT](https://github.com/kolirt/vue-web3-auth/tree/v2/LICENSE).

# Other packages

Check out my other projects on my [GitHub profile](https://github.com/kolirt).