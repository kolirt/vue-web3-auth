import { watchContractEvent as masterWatchContractEvent } from '@wagmi/core'
import type { TransactionReceipt } from 'viem/types/transaction'
import { decodeEventLog } from 'viem/utils'

import { chain } from '../chain'
import type { DecodedEvent, ParseEvents, WatchContractEvent } from '../types'

export function parseEvents(data: ParseEvents, transactionReceipt: TransactionReceipt) {
  const result: DecodedEvent[] = []

  transactionReceipt.logs.forEach((log) => {
    try {
      result.push(
        decodeEventLog({
          abi: data.abi,
          topics: log.topics,
          data: log.data
        })
      )
    } catch (e) {
      /* empty */
    }
  })

  return result
}

export function watchContractEvent(data: WatchContractEvent, callback: (log: any) => void) {
  return masterWatchContractEvent(
    {
      chainId: data?.chainId || chain.value.id,
      address: data.address,
      abi: data.abi,
      eventName: data.eventName
    },
    callback
  )
}
