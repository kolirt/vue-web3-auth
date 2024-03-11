<script setup lang="ts">
import { computed, reactive, ref } from 'vue'

import {
  $off,
  $on,
  type Chain,
  Events,
  account,
  accountDetails,
  chain,
  getAvailableChains,
  connect as masterConnect,
  disconnect as masterDisconnect,
  signMessage as masterSignMessage,
  switchChain as masterSwitchChain,
  selectChain
} from '../lib'

const loading = reactive({
  connecting: false,
  connectingTo: {} as Record<number, boolean>,
  switchingTo: {} as Record<number, boolean>,
  logouting: false
})

async function connect(newChain?: Chain) {
  const handler = (state: boolean) => {
    if (!state) {
      if (newChain) {
        loading.connectingTo[newChain.id] = false
      } else {
        loading.connecting = false
      }

      $off(Events.ModalStateChanged, handler)
    }
  }

  $on(Events.ModalStateChanged, handler)

  if (newChain) {
    loading.connectingTo[newChain.id] = true
  } else {
    loading.connecting = true
  }

  await masterConnect(newChain)
}

async function disconnect() {
  loading.logouting = true

  const handler = () => {
    loading.logouting = false
    $off(Events.Disconnected, handler)
  }

  $on(Events.Disconnected, handler)

  await masterDisconnect().catch(() => {
    loading.logouting = false
    $off(Events.Disconnected, handler)
  })
}

async function switchChain(newChain: Chain) {
  if (!loading.switchingTo[newChain.id]) {
    loading.switchingTo[newChain.id] = true
    await masterSwitchChain(newChain).finally(() => {
      loading.switchingTo[newChain.id] = false
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
  return chains.filter((item) => item.id !== chain.value.id)
})

const signMessageLoading = ref(false)
const message = ref('')
const messageResponse = ref('')
async function signMessage() {
  if (!signMessageLoading.value) {
    signMessageLoading.value = true
    messageResponse.value = ''
    masterSignMessage(message.value)
      .then((data) => {
        messageResponse.value = data
      })
      .catch((e) => {
        messageResponse.value = e
      })
      .finally(() => {
        signMessageLoading.value = false
      })
  }
}
</script>

<template>
  <div class="container py-5">
    <div class="bg-body-secondary rounded p-5">
      <div class="d-grid d-sm-flex mb-3 gap-2">
        <img
          src="https://img.shields.io/static/v1?label=Made%20with&message=VueJS&color=limegreen&style=for-the-badge&logo=vue.js"
          alt="vuejs"
        />
        <img src="https://img.shields.io/badge/Made%20for-Dapps-orange?style=for-the-badge&logo=ethereum" alt="dapp" />
      </div>

      <iframe
        src="https://ghbtns.com/github-btn.html?user=kolirt&repo=vue-web3-auth&type=star&count=true&size=large"
        frameborder="0"
        scrolling="0"
        width="170"
        height="30"
        title="GitHub"
        class="mb-3"
      >
      </iframe>

      <div class="d-grid d-sm-flex mb-3 gap-2">
        <a href="https://github.com/kolirt/vue-web3-auth" target="_blank">Github</a>
        <a href="https://www.npmjs.com/package/@kolirt/vue-web3-auth" target="_blank">Npmjs</a>
        <a href="https://github.com/kolirt/vue-web3-auth/tree/master/README.md" target="_blank">Docs</a>
        <a href="https://github.com/kolirt/vue-web3-auth/tree/master/examples" target="_blank">Example</a>
      </div>

      <h1>Web3 authentication for Vue3 apps</h1>
      <p class="lead">Simple WalletConnect Web3Modal v2 integration package for Vue3 dApps</p>

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

        <hr />

        <div class="mb-3">
          <label for="signMessageInput" class="form-label">Message</label>
          <textarea class="form-control" id="signMessageInput" rows="3" v-model="message"></textarea>
        </div>
        <p v-if="messageResponse">{{ messageResponse }}</p>
        <div>
          <button @click="signMessage" :disabled="signMessageLoading" class="btn btn-primary" type="submit">
            {{ signMessageLoading ? 'Signing...' : 'Sign message' }}
          </button>
        </div>

        <hr />

        <div class="d-grid d-sm-flex mb-3 gap-2">
          <button @click="accountDetails" class="btn btn-primary">Account details</button>
        </div>

        <div class="d-grid d-sm-flex mb-3 gap-2">
          <button @click="selectChain" class="btn btn-primary">Select chain via the wc modal</button>
        </div>

        <div class="d-grid d-sm-flex mb-3 gap-2">
          <button
            v-for="item in availableChains"
            @click="switchChain(item)"
            :key="item.id"
            class="btn btn-outline-primary"
          >
            {{ loading.switchingTo[item.id] ? `Switching chain to ${item.name}...` : `Switch chain to ${item.name}` }}
          </button>
        </div>

        <hr />

        <div class="d-grid d-sm-flex mb-3 gap-2">
          <button
            v-for="item in availableChains"
            @click="reconnect(item)"
            :key="item.id"
            class="btn btn-outline-primary"
          >
            Reconnect to {{ item.name }}
          </button>

          <button @click="disconnect" class="btn btn-danger">
            {{ loading.logouting ? 'Logouting...' : 'Logout' }}
          </button>
        </div>
      </template>

      <div v-else class="d-grid d-sm-flex mb-3 gap-2">
        <button @click="connect()" class="btn btn-primary">
          {{ loading.connecting ? 'Connecting...' : 'Connect wallet' }}
        </button>

        <button v-for="item in chains" @click="connect(item)" :key="item.id" class="btn btn-outline-primary">
          {{ loading.connectingTo[item.id] ? `Connecting to ${item.name}...` : `Connect to ${item.name}` }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
