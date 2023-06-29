import type {TransactionReceipt} from 'viem/src/types/transaction'
import type {ParseEvents, WatchContractEvent} from '../types'
import {watchContractEvent as masterWatchContractEvent} from '@wagmi/core'
import {decodeEventLog} from 'viem'
import {chain} from '../chain'

export function parseEvents(data: ParseEvents, transactionReceipt: TransactionReceipt) {
    return transactionReceipt.logs.map(log => {
        try {
            return decodeEventLog({
                abi: data.abi,
                topics: log.topics,
                data: log.data
            })
        } catch (e) {
            return undefined
        }
    }).filter(item => item)
}

export function watchContractEvent(data: WatchContractEvent, callback: (log: any) => void) {
    return masterWatchContractEvent({
        chainId: data?.chainId || chain.value.id,
        address: data.address,
        abi: data.abi,
        eventName: data.eventName
    }, callback)
}
