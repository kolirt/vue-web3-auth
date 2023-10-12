import { fetchToken as masterFetchToken } from '@wagmi/core'

import { chain } from '../chain'
import type { FetchToken } from '../types'

export function fetchToken(data: FetchToken) {
  return masterFetchToken({
    chainId: data.chainId || chain.value.id,
    address: data.address,
    formatUnits: data.formatUnits
  })
}
