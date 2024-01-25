import { disconnect as masterDisconnect } from '@wagmi/core'
import { reactive, readonly, watchEffect } from 'vue'

import { state as optionsState } from './options'
import type { AccountState, Chain, ConnectedAccount } from './types'
import { init } from './wc'
import { web3Modal } from './web3Modal'

export const state = reactive<AccountState>({
  bufferAccount: null,
  currentAccount: null
})

 const accountState = reactive<ConnectedAccount>({
  connected: false,
  address: undefined,
  shortAddress: undefined,
  wallet: {
    id: undefined,
    name: undefined
  }
})

export const account = readonly(accountState)

export async function disconnect() {
  await masterDisconnect()
}

export async function connect(chain?: Chain) {
  if (!web3Modal.value) init()

  if (chain instanceof Event) chain = optionsState.chains[0]
  web3Modal.value?.setDefaultChain(chain || optionsState.chains[0])

  await web3Modal.value?.openModal({
    route: 'ConnectWallet'
  })
}

export async function accountDetails() {
  if (!web3Modal.value) init()

  await web3Modal.value?.openModal({
    route: 'Account'
  })
}

export function shortAddressFilter(value = '') {
  return `${value.slice(0, 5)}...${value.slice(-4)}`
}

watchEffect(() => {
  if (state.currentAccount) {
    accountState.connected = true
    accountState.address = state.currentAccount.address
    accountState.shortAddress = shortAddressFilter(state.currentAccount.address)
    accountState.wallet.id = state.currentAccount.connector?.id
    accountState.wallet.name = state.currentAccount.connector?.name
  } else {
    accountState.connected = false
    accountState.address = undefined
    accountState.shortAddress = undefined
    accountState.wallet.id = undefined
    accountState.wallet.name = undefined
  }
})
