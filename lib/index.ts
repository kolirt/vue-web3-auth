import * as Chains from '@wagmi/core/chains'

export type {Chain, Options} from './types'

export {createWeb3Auth} from './plugin'

export {
    $on,
    $off
} from './event'

export {
    connect,
    disconnect,
    accountDetails,
    shortAddressFilter,
    account
} from './account'

export {
    selectChain,
    switchChain,
    getAvailableChains,
    chain
} from './chain'

export {
    fetchBalance
} from './actions/balance'

export {
    fetchBlockNumber
} from './actions/block'

export {
    fetchToken
} from './actions/token'

export {
    readContract,
    writeContract,
    estimateWriteContractGas
} from './actions/contract'

export {
    fetchGasPrice
} from './actions/gas'

export {
    multicall
} from './multicall'

export {
    Events
} from './enums'

export {
    Chains
}

export * from './utils/abi'