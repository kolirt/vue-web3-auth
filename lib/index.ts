import * as Chains from '@wagmi/core/chains'
import exp from 'constants'

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
} from './balance'

export {
    fetchToken
} from './token'

export {
    readContract,
    writeContract,
    estimateWriteContractGas
} from './contract'

export {
    fetchGasPrice
} from './gas'

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