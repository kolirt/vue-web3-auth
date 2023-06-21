import type {FetchFeeData} from '../types'
import {fetchFeeData as masterFetchFeeData} from '@wagmi/core'
import {chain} from '../chain'

export function fetchGasPrice(data?: FetchFeeData) {
    return masterFetchFeeData({
        chainId: data?.chainId || chain.value.id,
        formatUnits: data?.formatUnits
    })
}
