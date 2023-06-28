import type {BufferChain, WcState} from './types'
import {reactive, toRaw, watch} from 'vue'
import {configureChains, watchAccount, watchNetwork, createConfig, GetNetworkResult} from '@wagmi/core'
import {publicProvider} from 'wagmi/providers/public'
import {EthereumClient, w3mConnectors, w3mProvider} from '@web3modal/ethereum'
import {disconnect, state as accountState} from './account'
import {state as chainState} from './chain'
import {$emit} from './event'
import {$log} from './log'
import {initWeb3Modal, web3Modal} from './web3Modal'
import {state as optionsState} from './options'
import {Events} from './enums'

let onChangeHandler: any
export const state = reactive<WcState>({
    client: null
})

function toLowerCase(text: any) {
    return String(text).toLowerCase()
}

async function onChange(
    [newBufferAccount, newBufferChain]: [any, BufferChain],
    [prevBufferAccount, prevBufferChain]: [any, BufferChain]
) {
    if (
        optionsState.disconnectUnknownChain &&
        (!prevBufferAccount && optionsState.disconnectUnknownChain || prevBufferAccount) &&
        newBufferChain &&
        !optionsState.chains.some(item => item.id === newBufferChain.id)
    ) {
        await disconnect()
        if (prevBufferChain) {
            $emit(Events.Disconnected)
            $log(`account ${newBufferAccount.address} disconnected from ${toLowerCase(prevBufferChain.name)} chain.`)
        }

        $emit(Events.UnknownChain, {chain: newBufferChain})
        $log('switched to unsupported chain.')

        return
    }

    if (prevBufferAccount?.address !== newBufferAccount?.address && (!prevBufferChain?.unsupported)) {
        if (prevBufferAccount) {
            $emit(Events.Disconnected)
            $log(`account ${prevBufferAccount.address} disconnected from ${toLowerCase(prevBufferChain.name)} chain.`)
        }

        if (newBufferAccount) {
            $emit(Events.Connected, {chain: chainState.bufferChain, account: accountState.bufferAccount})
            $log(`account ${newBufferAccount.address} connected to ${toLowerCase(newBufferChain.name)} chain.`)
        }
    }

    if (prevBufferChain && newBufferChain && prevBufferChain.id !== newBufferChain.id) {
        if (optionsState.reconnectToChain) {
            $emit(Events.Disconnected)
            $log(`account ${prevBufferAccount.address} disconnected from ${toLowerCase(prevBufferChain.name)} chain.`)

            $emit(Events.Connected, {chain: chainState.bufferChain, account: accountState.bufferAccount})
            $log(`account ${newBufferAccount.address} connected to ${toLowerCase(newBufferChain.name)} chain.`)
        } else {
            $emit(Events.ChainSwitched, {chain: newBufferChain})
            $log(`account ${newBufferAccount.address} switched to ${toLowerCase(newBufferChain.name)} chain.`)
        }
    }
}

function emitOnChange(
    [newBufferAccount, newBufferChain]: [any, BufferChain],
    [prevBufferAccount, prevBufferChain]: [any, BufferChain]
) {
    clearTimeout(onChangeHandler)
    onChangeHandler = setTimeout(onChange, 200, [newBufferAccount, newBufferChain], [prevBufferAccount, prevBufferChain])
}

export function init() {
    if (web3Modal.value) return

    const chains = toRaw(optionsState.chains)
    const providers = []

    if (optionsState.enableCustomProvider) {
        providers.push(publicProvider())
    } else {
        providers.push(w3mProvider({projectId: optionsState.projectId}))
    }

    const {publicClient, webSocketPublicClient} = configureChains(chains, providers)

    const wagmiConfig = createConfig({
        autoConnect: optionsState.autoConnect,
        connectors: w3mConnectors({
            projectId: optionsState.projectId,
            chains: chains
        }),
        publicClient,
        webSocketPublicClient
    })

    watchNetwork((data: GetNetworkResult) => {
        if (data.chain?.unsupported) {
            data.chain.name = 'Unsupported'
        }
        chainState.bufferChain = data.chain || null
    })
    watchAccount((data) => {
        accountState.bufferAccount = data.address ? data : null
    })

    // @ts-ignore
    watch([() => accountState.bufferAccount, () => chainState.bufferChain], emitOnChange)

    const client = new EthereumClient(wagmiConfig, chains)
    state.client = client
    initWeb3Modal(client)
}
