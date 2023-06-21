import type {Chain, Unit} from '@wagmi/core'
import type {ThemeCtrlState} from '@web3modal/core'
import type {EthereumClient} from '@web3modal/ethereum'
import type {BlockTag} from 'viem/src/types/block'

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
    connected: boolean
    address?: `0x${string}`
    shortAddress?: string
}

export type BufferChain = Chain & { unsupported?: boolean }

export type ChainState = {
    bufferChain: BufferChain | null
    currentChain: BufferChain | null
}

export type WcState = {
    client: EthereumClient | null
}

export type AccountState = {
    bufferAccount: any
    currentAccount: any
}

export type MulticallContract = {
    abi: any
    contractAddress: string
    calls: [string, Array<any>?][]
}

export type MulticallArgs = {
    chainId?: number
    calls: MulticallContract[]
    multicallAddress?: `0x${string}`
    batchSize?: number
    allowFailure?: boolean
} & ({
    blockNumber?: bigint
    blockTag?: never
} | {
    blockNumber?: never
    blockTag?: BlockTag
})

export type ReadContract = {
    chainId?: number
    address: `0x${string}`
    abi: any
    functionName: string
    args?: any[]
    account?: `0x${string}`
    blockNumber?: bigint
    blockTag?: BlockTag
}

export type WriteContract = {
    chainId?: number
    address: `0x${string}`
    abi: any
    functionName: string
    args?: any[]
    account?: `0x${string}`
    gas?: bigint
    gasPrice?: bigint
    maxFeePerGas?: bigint
    maxPriorityFeePerGas?: bigint
    nonce?: number
    value?: bigint
    confirmations?: number
}

export type FetchBalance = {
    chainId?: number
    address: `0x${string}`
    formatUnits?: Unit
    token?: `0x${string}`
}

export type FetchToken = {
    chainId?: number
    address: `0x${string}`
    formatUnits?: Unit
}

export type FetchFeeData = {
    chainId?: number
    formatUnits?: Unit
}

export type FetchBlockNumber = {
    chainId?: number
}

export type FetchTransaction = {
    chainId?: number
    hash: `0x${string}`
}

export type SendTransaction = {
    chainId?: number
    to: string
    account?: `0x${string}`
    gas?: bigint
    gasPrice?: bigint
    maxFeePerGas?: bigint
    maxPriorityFeePerGas?: bigint
    nonce?: number
    value?: bigint
    confirmations?: number
}