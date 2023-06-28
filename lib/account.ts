import type {AccountState, ConnectedAccount, Chain} from './types'
import {reactive, watchEffect} from 'vue'
import {disconnect as masterDisconnect} from '@wagmi/core'
import {web3Modal} from './web3Modal'
import {init} from './wc'
import {state as optionsState} from './options'

export const state = reactive<AccountState>({
    bufferAccount: null,
    currentAccount: null
})

export const account = reactive<ConnectedAccount>({
    connected: false,
    address: undefined,
    shortAddress: undefined
})

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
        account.connected = true
        account.address = state.currentAccount.address
        account.shortAddress = shortAddressFilter(state.currentAccount.address)
    } else {
        account.connected = false
        account.address = undefined
        account.shortAddress = undefined
    }
})
