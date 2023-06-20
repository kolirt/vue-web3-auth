import type {ReadContract} from './types'
import {readContract as masterReadContract} from '@wagmi/core'
import {chain} from './chain'
import {account} from './account'

export async function readContract(data: ReadContract) {
    // @ts-ignore
    return masterReadContract({
        chainId: data.chain || chain.value.id,
        address: data.address,
        abi: data.abi,
        functionName: data.functionName,
        args: data.args || [],
        account: account.address,
        blockNumber: data.blockNumber,
        blockTag: data.blockTag
    })
}
