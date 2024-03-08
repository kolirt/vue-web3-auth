import { multicall as masterMulticall, type MulticallResult } from '@wagmi/core'
import { type MulticallParameters } from 'viem/actions'
import { type ContractFunctionConfig } from 'viem/types/contract'

import type { MulticallArgs } from '../types'

export async function multicall<TContracts extends ContractFunctionConfig[], TAllowFailure extends boolean = true>(
  params: MulticallArgs<TAllowFailure>
): Promise<MulticallResult<TContracts, TAllowFailure>> {
  // @ts-ignore
  const contracts: TContracts = [] as TContracts

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

  return await masterMulticall<TContracts, TAllowFailure>({
    chainId: params.chainId,
    contracts: contracts as MulticallParameters<TContracts, TAllowFailure>['contracts'],
    multicallAddress: params.multicallAddress,
    blockTag: params.blockTag,
    blockNumber: params.blockNumber,
    batchSize: params.batchSize,
    allowFailure: params.allowFailure
  })
}
