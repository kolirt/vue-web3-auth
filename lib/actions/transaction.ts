import type {FetchTransaction} from '../types'
import {fetchTransaction as masterFetchTransaction} from '@wagmi/core'
import {chain} from '../chain'

export function fetchTransaction(data: FetchTransaction) {
    return masterFetchTransaction({
        chainId: data.chainId || chain.value.id,
        hash: data.hash
    })
}
