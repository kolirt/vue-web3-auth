import { fetchFeeData as masterFetchFeeData } from '@wagmi/core'

import { chain } from '../chain'
import type { FetchFeeData } from '../types'

export function fetchGasPrice(data?: FetchFeeData) {
  return masterFetchFeeData({
    chainId: data?.chainId || chain.value.id,
    formatUnits: data?.formatUnits
  })
}
