import * as Chains from '@wagmi/core/chains'

export { account, accountDetails, connect, disconnect, shortAddressFilter } from './account'
export * from './actions'
export { chain, getAvailableChains, selectChain, switchChain } from './chain'
export { Events } from './enums'
export { $off, $on } from './event'
export { createWeb3Auth } from './plugin'
export type { Chain, MulticallArgs, MulticallContract, Options } from './types'
export * from './utils/abi'
export { init } from './wc'
export { Chains }
