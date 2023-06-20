<h1 align="center">Web3 authentication for Vue3 apps based on WalletConnect v2 and wagmi</h1>

<p style="display: flex; align-content: center; justify-content: center;">
  <img src="https://img.shields.io/static/v1?label=Made%20with&message=VueJS&color=limegreen&style=for-the-badge&logo=vue.js" />
  <img src="https://img.shields.io/badge/Made%20for-Dapps-orange?style=for-the-badge&logo=ethereum" />
</p>

Simple WalletConnect v2 integration package for Vue3 apps.

**Table of Contents**
- [Getting started](#getting-started)
    - [Installation](#installation)
    - [Setup](#setup)
- [Usage](#usage)
    - [Connect wallet button](#connect-wallet-button)
    - [Multicall](#multicall)
    - [ReadContract](#readcontract)
    - [WriteContract](#writecontract)
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

# Usage
## Connect wallet button
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

## Multicall
```js
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

## ReadContract

```js
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

## WriteContract

```js
import {erc20ABI, writeContract} from '@kolirt/vue-web3-auth'

let data = await writeContract({
  abi: erc20ABI,
  address: '0x55d398326f99059fF775485246999027B3197955',
  functionName: 'approve',
  args: ['0x685B1ded8013785d6623CC18D214320b6Bb64759', 100]
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