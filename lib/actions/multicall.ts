import { type MulticallConfig, multicall as masterMulticall } from '@wagmi/core'

import type { MulticallArgs, Writeable } from '../types'

export async function multicall(params: MulticallArgs) {
  const contracts: Writeable<MulticallConfig['contracts']> = []

  params.calls.forEach((item) => {
    item.calls.forEach(([functionName, args]) => {
      contracts.push({
        address: item.contractAddress,
        abi: item.abi,
        functionName,
        args
      })
    })
  })

  return await masterMulticall({
    chainId: params.chainId,
    contracts,
    multicallAddress: params.multicallAddress,
    blockTag: params.blockTag,
    blockNumber: params.blockNumber,
    batchSize: params.batchSize,
    allowFailure: params.allowFailure
  })
}
