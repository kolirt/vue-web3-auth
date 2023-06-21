import * as Chains from '@wagmi/core/chains'

export * from './actions'

export * from './utils/abi'

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
    Events
} from './enums'

export {
    $on,
    $off
} from './event'

export {createWeb3Auth} from './plugin'

export type {Chain, Options} from './types'

export {init} from './wc'

export {
    Chains
}
