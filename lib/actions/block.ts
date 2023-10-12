import { fetchBlockNumber as masterFetchBlockNumber } from '@wagmi/core'

import { chain } from '../chain'
import type { FetchBlockNumber } from '../types'

export function fetchBlockNumber(data?: FetchBlockNumber) {
  return masterFetchBlockNumber({
    chainId: data?.chainId || chain.value.id
  })
}
