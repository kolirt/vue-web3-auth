import { getWalletClient } from '@wagmi/core'

import { chain } from '../chain'
import type { WatchAsset } from '../types'

export async function watchAsset(options: WatchAsset) {
  const walletClient = await getWalletClient({ chainId: options.chainId || chain.value.id })

  if (walletClient) {
    return await walletClient.watchAsset({
      type: 'ERC20',
      options: {
        address: options.address,
        symbol: options.symbol,
        decimals: options.decimals,
        image: options.image
      }
    })
  }

  return false
}
