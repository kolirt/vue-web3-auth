<h1 align="center">Web3 authentication for Vue3 apps based on WalletConnect v2 and wagmi</h1>

<p align="center">
  <img src="https://img.shields.io/static/v1?label=Made%20with&message=VueJS&color=limegreen&style=for-the-badge&logo=vue.js" />
  <img src="https://img.shields.io/badge/Made%20for-Dapps-orange?style=for-the-badge&logo=ethereum" />
</p>

Simple WalletConnect v2 integration package for Vue3 apps.

**Table of Contents**

- [Getting started](#getting-started)
    - [Installation](#installation)
    - [Setup](#setup)
      - [Configuration](#configuration)
      - [Custom chain](#custom-chain)
      - [Custom rpc provider](#custom-rpc-provider)
- [Usage](#usage)
    - [Basic usage](#basic-usage)
        - [Connect wallet button](#connect-wallet-button)
        - [FetchGasPrice](#fetchgasprice)
        - [FetchBlockNumber](#fetchblocknumber)
        - [FetchTransaction](#fetchtransaction)
        - [SendTransaction](#sendtransaction)
        - [SignMessage](#signmessage)
        - [Multicall](#multicall)
        - [FetchBalance](#fetchbalance)
        - [FetchToken](#fetchtoken)
        - [ReadContract](#readcontract)
        - [WriteContract](#writecontract)
        - [WatchContractEvent](#watchcontractevent)
        - [EstimateWriteContractGas](#estimatewritecontractgas)
    - [Composable](#composable)
        - [UseFetchBalance](#usefetchbalance)
- [Demo](#demo)
- [Example](#example)
- [Faq](#faq)
- [License](#license)

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
import {createApp} from 'vue'
import {Chains, createWeb3Auth} from '@kolirt/vue-web3-auth'

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
import {Chain} from '@kolirt/vue-web3-auth'

const bsc: Chain = {
    id: 56,
    name: 'BNB Smart Chain',
    network: 'bsc',
    nativeCurrency: {
        decimals: 18,
        name: 'BNB',
        symbol: 'BNB',
    },
    rpcUrls: {
        default: {
            http: ['https://rpc.ankr.com/bsc'],
            webSocket: ['wss://bsc-ws-node.nariox.org:443']
        },
        public: {
            http: ['https://rpc.ankr.com/bsc'],
            webSocket: ['wss://bsc-ws-node.nariox.org:443']
        },
    },
    blockExplorers: {
        etherscan: {
            name: 'BscScan',
            url: 'https://bscscan.com',
        },
        default: {
            name: 'BscScan',
            url: 'https://bscscan.com',
        },
    },
    contracts: {
        multicall3: {
            address: '0xca11bde05977b3631167028862be2a173976ca11',
            blockCreated: 15921452,
        },
    },
}
```

### Custom rpc provider

By default, the package uses the w3m rpc provider. If you want to use a custom rpc from the chain, you can set the `enableCustomProvider` option to true.

```ts
app.use(createWeb3Auth({
    enableCustomProvider: true
})
```

# Usage

## Basic usage

### Connect wallet button

```vue
<script setup lang="ts">
import {account, disconnect, connect} from '@kolirt/vue-web3-auth'
</script>

<template>
  <button v-if="account.connected" @click="disconnect()">
    {{ account.address }}
  </button>
  <button v-else @click="connect()">
    Connect wallet
  </button>
</template>
```

### FetchGasPrice

```js
import {fetchGasPrice} from '@kolirt/vue-web3-auth'

let data = await fetchGasPrice()

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

```js
import {fetchBlockNumber} from '@kolirt/vue-web3-auth'

let data = await fetchBlockNumber()

/**
 * Result in data
 *
 * 29288229n
 */
```

### FetchTransaction

```js
import {fetchTransaction} from '@kolirt/vue-web3-auth'

let txn = await fetchTransaction({
    hash: '0x7ed8dc64f54ae43f4d53173e95aa929c52de44ec5cea8c28246989914ed7f4fb'
})
```

### SendTransaction

```js
import {sendTransaction} from '@kolirt/vue-web3-auth'

let txn = await sendTransaction({
    to: '0x2D4C407BBe49438ED859fe965b140dcF1aaB71a9',
    value: 1n
})
```

### SignMessage

```js
import {signMessage} from '@kolirt/vue-web3-auth'

const signature = await signMessage('test message')
```

### Multicall

```ts
import {multicallABI, multicall, chain} from '@kolirt/vue-web3-auth'

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

```js
import {fetchBalance} from '@kolirt/vue-web3-auth'

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

```js
import {fetchToken} from '@kolirt/vue-web3-auth'

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
import {erc20ABI, readContract} from '@kolirt/vue-web3-auth'

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
import {erc20ABI, writeContract} from '@kolirt/vue-web3-auth'

let data = await writeContract({
    abi: erc20ABI,
    address: '0x55d398326f99059fF775485246999027B3197955',
    functionName: 'approve',
    args: ['0x685B1ded8013785d6623CC18D214320b6Bb64759', 100]
})
```

### WatchContractEvent

```js
import {erc20ABI, watchContractEvent} from '@kolirt/vue-web3-auth'

const unwatch = watchContractEvent({
    address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    abi: erc20ABI,
    eventName: 'Transfer'
}, (log) => {
    console.log(log)
})
```

### EstimateWriteContractGas

```ts
import {erc20ABI, estimateWriteContractGas} from '@kolirt/vue-web3-auth'

const gas = await estimateWriteContractGas({
    abi: erc20ABI,
    address: '0x55d398326f99059fF775485246999027B3197955',
    functionName: 'approve',
    args: ['0x685B1ded8013785d6623CC18D214320b6Bb64759', 100]
}).catch(e => {
})
```

## Composable

### UseFetchBalance
```js
import {useFetchBalance} from '@kolirt/vue-web3-auth'

// use `fetch` for manual init when `disableAutoFetch` is `true`
const {
    loaded, fetching, data, 
    fetch, reload, disableAutoReload
} = useFetchBalance({
    address: '0x2D4C407BBe49438ED859fe965b140dcF1aaB71a9'
}, {
    disableAutoFetch: false,
    autoReloadTime: 30000,
    disableAutoReload: false
})
```

# Demo

[Demo here](https://kolirt.github.io/vue-web3-auth/).

# Example

[Example here](https://github.com/kolirt/vue-web3-auth/blob/master/src).

# FAQ

Check closed [issues](https://github.com/kolirt/vue-web3-auth/issues) to get answers for most asked questions.

# License

[MIT](https://github.com/kolirt/vue-web3-auth/blob/master/LICENSE).