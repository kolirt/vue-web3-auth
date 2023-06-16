import type {Chain} from '@wagmi/core'
import type {ThemeCtrlState} from '@web3modal/core'
import type {EthereumClient} from '@web3modal/ethereum'

export type Options = {
    autoInit?: boolean // when true, plugin WalletConnect will init automatically
    projectId: string
    chains: Chain[]
    autoConnect?: boolean // when true wc will auto connect if was connected previously
    disconnectUnknownChain?: boolean // when selected unknown chain, account will disconnect
    reconnectToChain?: boolean // when chain changed account will disconnect then connect again. when true, event "chain_switched" isn't available
    logEnabled?: boolean
    web3modalOptions?: ThemeCtrlState
}

export type {Chain}

export type ConnectedAccount = {
    connected: boolean,
    address?: string,
    shortAddress?: string
}

export type BufferChain = Chain & { unsupported?: boolean }

export type ChainState = {
    bufferChain: BufferChain | null,
    currentChain: BufferChain | null
}

export type WcState = {
    client: EthereumClient | null
}

export type AccountState = {
    bufferAccount: any,
    currentAccount: any
}