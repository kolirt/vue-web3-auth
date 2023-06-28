import type {WaitForTransactionResult} from '@wagmi/core'
import type {ReadContract, WriteContract} from '../types'
import {
    getPublicClient,
    readContract as masterReadContract,
    writeContract as masterWriteContract,
    waitForTransaction
} from '@wagmi/core'
import {chain} from '../chain'
import {account} from '../account'

export async function readContract(data: ReadContract) {
    return masterReadContract({
        chainId: data.chainId || chain.value.id,
        address: data.address,
        abi: data.abi,
        functionName: data.functionName,
        args: data.args || [],
        account: data.account || account.address,
        blockNumber: data.blockNumber,
        blockTag: data.blockTag
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
        value: data.value
    })

    function wait() {
        return waitForTransaction({
            chainId: data.chainId || chain.value.id,
            hash,
            confirmations: data.confirmations || 1
        })
    }

    return {
        hash,
        wait
    } as { hash: `0x${string}`, wait: () => Promise<WaitForTransactionResult> }
}

export async function estimateWriteContractGas(data: WriteContract) {
    const publicClient = getPublicClient({chainId: data.chainId || chain.value.id})

    return await publicClient.estimateContractGas({
        address: data.address,
        abi: data.abi,
        functionName: data.functionName,
        args: data.args || [],
        // @ts-ignore
        account: data.account || account.address,
        gasPrice: data.gasPrice,
        maxFeePerGas: data.maxFeePerGas,
        maxPriorityFeePerGas: data.maxPriorityFeePerGas,
        nonce: data.nonce,
        value: data.value
    })
}
