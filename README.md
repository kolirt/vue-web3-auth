<h1 align="center">Web3 authentication for Vue3 apps based on WalletConnect v2</h1>

<p style="display: flex; align-content: center; justify-content: center;">
  <img src="https://img.shields.io/static/v1?label=Made%20with&message=VueJS&color=limegreen&style=for-the-badge&logo=vue.js" />
  <img src="https://img.shields.io/badge/Made%20for-Dapps-orange?style=for-the-badge&logo=ethereum" />
</p>

<a href="https://www.buymeacoffee.com/kolirt" target="_blank">
  <img src="https://cdn.buymeacoffee.com/buttons/v2/arial-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" >
</a>

Simple WalletConnect v2 integration package for Vue3 apps.

**Table of Contents**
- [Getting started](#getting-started)
    - [Installation](#installation)
    - [Setup](#setup)
- [Usage](#usage)
    - [Connect wallet button](#connect-wallet-button)
- [Demo](#demo)
- [Example](#example)
- [Faq](#faq)
- [License](#license)

[//]: # (# Web3 authentication for Vue3 apps)
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

# Demo
[Demo here](https://kolirt.github.io/vue-web3-auth/).

# Example
[Example here](https://github.com/kolirt/vue-web3-auth/blob/master/src).

# FAQ
Check closed [issues](https://github.com/kolirt/vue-web3-auth/issues) to get answers for most asked questions.

# License
[MIT](https://github.com/kolirt/vue-web3-auth/blob/master/LICENSE).