import type {Options} from './types'
import {reactive} from 'vue'
import {mainnet} from 'viem/chains'

export const state = reactive<Options>({
    autoInit: true,
    projectId: '',
    chains: [mainnet],
    autoConnect: true,
    disconnectUnknownChain: true,
    reconnectToChain: true,
    logEnabled: false,
    enableCustomProvider: false,
    web3modalOptions: {
        themeMode: 'light',
        themeVariables: {}
    }
})

export function setOptions(newOptions: Options | {}): void {
    if ('autoInit' in newOptions) state.autoInit = newOptions.autoInit
    if ('projectId' in newOptions) state.projectId = newOptions.projectId
    if ('chains' in newOptions) state.chains = newOptions.chains
    if ('autoConnect' in newOptions) state.autoConnect = newOptions.autoConnect
    if ('disconnectUnknownChain' in newOptions) state.disconnectUnknownChain = newOptions.disconnectUnknownChain
    if ('reconnectToChain' in newOptions) state.reconnectToChain = newOptions.reconnectToChain
    if ('logEnabled' in newOptions) state.logEnabled = newOptions.logEnabled
    if ('enableCustomProvider' in newOptions) state.enableCustomProvider = newOptions.enableCustomProvider

    // @ts-ignore
    if ('web3modalOptions' in newOptions) {
        // @ts-ignore
        if ('themeMode' in newOptions.web3modalOptions) state.web3modalOptions.themeMode = newOptions.web3modalOptions.themeMode

        // @ts-ignore
        if ('themeVariables' in newOptions.web3modalOptions) state.web3modalOptions.themeVariables = newOptions.web3modalOptions.themeVariables
    }
}
