import type {FetchBlockNumber} from '../types'
import {fetchBlockNumber as masterFetchBlockNumber} from '@wagmi/core'
import {chain} from '../chain'

export function fetchBlockNumber(data?: FetchBlockNumber) {
    return masterFetchBlockNumber({
        chainId: data?.chainId || chain.value.id
    })
}
