import type {FetchToken} from '../types'
import {fetchToken as masterFetchToken} from '@wagmi/core'
import {chain} from '../chain'

export function fetchToken(data: FetchToken) {
    return masterFetchToken({
        chainId: data.chainId || chain.value.id,
        address: data.address,
        formatUnits: data.formatUnits
    })
}
