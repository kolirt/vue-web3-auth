import type {FetchTransaction, SendTransaction} from '../types'
import {
    fetchTransaction as masterFetchTransaction,
    sendTransaction as masterSendTransaction, waitForTransaction
} from '@wagmi/core'
import {chain} from '../chain'

export function fetchTransaction(data: FetchTransaction) {
    return masterFetchTransaction({
        chainId: data.chainId || chain.value.id,
        hash: data.hash
    })
}

export async function sendTransaction(data: SendTransaction) {
    const {hash} = await masterSendTransaction({
        chainId: data.chainId || chain.value.id,
        to: data.to,
        account: data.account,
        gas: data.gas,
        gasPrice: data.gasPrice,
        maxFeePerGas: data.maxFeePerGas,
        maxPriorityFeePerGas: data.maxPriorityFeePerGas,
        nonce: data.nonce,
        value: data.value
    })

    return waitForTransaction({
        chainId: data.chainId || chain.value.id,
        hash,
        confirmations: data.confirmations || 1
    })
}
