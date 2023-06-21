import type {FetchBalance} from '../types'
import {fetchBalance as masterFetchBalance} from '@wagmi/core'
import {chain} from '../chain'

export function fetchBalance(data: FetchBalance) {
    return masterFetchBalance({
        chainId: data.chainId || chain.value.id,
        address: data.address,
        token: data.token,
        formatUnits: data.formatUnits
    })
}
