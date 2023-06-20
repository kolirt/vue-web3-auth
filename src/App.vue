<script setup lang="ts">
import type {Chain} from '../lib'
import {computed, reactive} from 'vue'
import {
  $off,
  $on,
  account,
  accountDetails,
  chain,
  connect as masterConnect,
  disconnect as masterDisconnect,
  Events,
  getAvailableChains,
  selectChain,
  switchChain as masterSwitchChain
} from '../lib'

const loading = reactive({
  connecting: false,
  connectingTo: {} as any,
  switchingTo: {} as any,
  logouting: false
})

async function connect(chain?: Chain) {
  const handler = (state: boolean) => {
    if (!state) {
      if (chain) {
        loading.connectingTo[chain.id] = false
      } else {
        loading.connecting = false
      }

      $off(Events.ModalStateChanged, handler)
    }
  }

  $on(Events.ModalStateChanged, handler)

  if (chain) {
    loading.connectingTo[chain.id] = true
  } else {
    loading.connecting = true
  }

  await masterConnect(chain)
}

async function disconnect() {
  loading.logouting = true

  const handler = () => {
    loading.logouting = false
    $off(Events.Disconnected, handler)
  }

  $on(Events.Disconnected, handler)

  await masterDisconnect()
      .catch(() => {
        loading.logouting = false
        $off(Events.Disconnected, handler)
      })
}

async function switchChain(chain: Chain) {
  if (!loading.switchingTo[chain.id]) {
    loading.switchingTo[chain.id] = true
    await masterSwitchChain(chain)
        .finally(() => {
          loading.switchingTo[chain.id] = false
        })
  }
}

async function reconnect(newChain: Chain) {
  if (chain.value.id !== newChain.id) {
    await masterDisconnect()
    await masterConnect(newChain)
  }
}

const chains = getAvailableChains()
const availableChains = computed(() => {
  return chains.filter(item => item.id !== chain.value.id)
})
</script>

<template>
  <div class="container py-5">
    <div class="bg-body-secondary p-5 rounded">
      <div class="mb-3 d-grid gap-2 d-sm-flex">
        <img
            src="https://img.shields.io/static/v1?label=Made%20with&message=VueJS&color=limegreen&style=for-the-badge&logo=vue.js"
            alt="vuejs"/>
        <img src="https://img.shields.io/badge/Made%20for-Dapps-orange?style=for-the-badge&logo=ethereum" alt="dapp"/>
      </div>

      <iframe src="https://ghbtns.com/github-btn.html?user=kolirt&repo=vue-web3-auth&type=star&count=true&size=large"
              frameborder="0" scrolling="0" width="170" height="30" title="GitHub" class="mb-3">
      </iframe>

      <div class="mb-3 d-grid gap-2 d-sm-flex">
        <a href="https://github.com/kolirt/vue-web3-auth" target="_blank">Github</a>
        <a href="https://www.npmjs.com/package/@kolirt/vue-web3-auth" target="_blank">Npmjs</a>
        <a href="https://github.com/kolirt/vue-web3-auth/blob/master/README.md" target="_blank">Docs</a>
        <a href="https://github.com/kolirt/vue-web3-auth/blob/master/src" target="_blank">Example</a>
      </div>

      <h1>Web3 authentication for Vue3 apps</h1>
      <p class="lead">Simple WalletConnect v2 integration package for Vue3 dApps</p>

      <template v-if="account.connected">
        <ul>
          <li class="mb-2">
            <span>Wallet info:</span>
            <ul>
              <li>Connected: {{ account.connected }}</li>
              <li>Address: {{ account.address }}</li>
              <li>Short address: {{ account.shortAddress }}</li>
            </ul>
          </li>
          <li>
            <span>Chain info:</span>
            <ul>
              <li>ID: {{ chain.id }}</li>
              <li>Network: {{ chain.network }}</li>
              <li>Name: {{ chain.name }}</li>
              <li>Native currency: {{ chain.nativeCurrency.symbol }}</li>
              <li>
                Explorer:
                <a :href="chain.blockExplorers?.default.url" target="_blank">
                  {{ chain.blockExplorers?.default.name }}
                </a>
              </li>
            </ul>
          </li>
        </ul>

        <hr>

        <div class="mb-3 d-grid gap-2 d-sm-flex">
          <button @click="accountDetails" class="btn btn-primary">
            Account details
          </button>
        </div>

        <div class="mb-3 d-grid gap-2 d-sm-flex">
          <button @click="selectChain" class="btn btn-primary">
            Select chain via the wc modal
          </button>
        </div>

        <div class="mb-3 d-grid gap-2 d-sm-flex">
          <button v-for="item in availableChains" @click="switchChain(item)" class="btn btn-outline-primary"
                  :key="item.id">
            {{ loading.switchingTo[item.id] ? `Switching chain to ${item.name}...` : `Switch chain to ${item.name}` }}
          </button>
        </div>

        <div class="mb-3 d-grid gap-2 d-sm-flex">
          <button v-for="item in availableChains" @click="reconnect(item)" class="btn btn-outline-primary"
                  :key="item.id">
            Reconnect to {{ item.name }}
          </button>
        </div>

        <hr>

        <button @click="disconnect" class="btn btn-danger">
          {{ loading.logouting ? 'Logouting...' : 'Logout' }}
        </button>
      </template>

      <div v-else class="mb-3 d-grid gap-2 d-sm-flex">
        <button @click="connect()" class="btn btn-primary">
          {{ loading.connecting ? 'Connecting...' : 'Connect wallet' }}
        </button>

        <button v-for="item in chains" @click="connect(item)" class="btn btn-outline-primary" :key="item.id">
          {{ loading.connectingTo[item.id] ? `Connecting to ${item.name}...` : `Connect to ${item.name}` }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
