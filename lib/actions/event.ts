import type {WatchContractEvent} from '../types'
import {watchContractEvent as masterWatchContractEvent} from '@wagmi/core'
import {chain} from '../chain'

export function watchContractEvent(data: WatchContractEvent, callback: (log: any) => void) {
    return masterWatchContractEvent({
        chainId: data?.chainId || chain.value.id,
        address: data.address,
        abi: data.abi,
        eventName: data.eventName
    }, callback)
}
