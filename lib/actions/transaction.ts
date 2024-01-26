import {
  getPublicClient,
  fetchTransaction as masterFetchTransaction,
  prepareSendTransaction as masterPrepareSendTransaction,
  sendTransaction as masterSendTransaction,
  waitForTransaction as masterWaitForTransaction
} from '@wagmi/core'

import { chain } from '../chain'
import type {
  FetchTransaction,
  FetchTransactionReceipt,
  PrepareSendTransaction,
  SendTransaction,
  WaitTransaction
} from '../types'

export function fetchTransaction(data: FetchTransaction) {
  return masterFetchTransaction({
    chainId: data.chainId || chain.value.id,
    hash: data.hash
  })
}

export function fetchTransactionReceipt(data: FetchTransactionReceipt) {
  const publicClient = getPublicClient({ chainId: data.chainId || chain.value.id })

  return publicClient.getTransactionReceipt({
    hash: data.hash
  })
}

export function prepareSendTransaction(data: PrepareSendTransaction) {
  return masterPrepareSendTransaction({
    chainId: data.chainId || chain.value.id,
    ...data
  })
}

export function sendTransaction(data: SendTransaction) {
  return masterSendTransaction({
    chainId: data.chainId || chain.value.id,
    ...data
  })
}

export function waitForTransaction(data: WaitTransaction) {
  return masterWaitForTransaction({
    chainId: data.chainId || chain.value.id,
    ...data
  })
}
