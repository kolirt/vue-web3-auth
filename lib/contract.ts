import type {ReadContract, WriteContract} from './types'
import {
    readContract as masterReadContract, waitForTransaction,
    writeContract as masterWriteContract
} from '@wagmi/core'
import {chain} from './chain'
import {account} from './account'

export async function readContract(data: ReadContract) {
    return masterReadContract({
        chainId: data.chainId || chain.value.id,
        address: data.address,
        abi: data.abi,
        functionName: data.functionName,
        args: data.args || [],
        account: data.account || account.address,
        blockNumber: data.blockNumber,
        blockTag: data.blockTag,
    })
}

export async function writeContract(data: WriteContract) {
    const {hash} = await masterWriteContract({
        chainId: data.chainId || chain.value.id,
        address: data.address,
        abi: data.abi,
        functionName: data.functionName,
        args: data.args || [],
        account: data.account || account.address,
        gas: data.gas,
        gasPrice: data.gasPrice,
        maxFeePerGas: data.maxFeePerGas,
        maxPriorityFeePerGas: data.maxPriorityFeePerGas,
        nonce: data.nonce,
        value: data.value,
    })

    return waitForTransaction({
        chainId: data.chainId || chain.value.id,
        hash,
        confirmations: data.confirmations || 1
    })
}
