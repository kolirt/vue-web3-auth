import { computed, reactive, watch } from 'vue'

import { state as optionsState } from './options'
import type { Chain, ChainState } from './types'
import { init, state as wcState } from './wc'
import { web3Modal } from './web3Modal'

export const state = reactive<ChainState>({
  bufferChain: null,
  currentChain: null
})

export const chain = computed<Chain>(() => {
  return state.currentChain ? state.currentChain : optionsState.chains[0]
})

export function getAvailableChains(): Chain[] {
  return optionsState.chains
}

export function switchChain(newChain: Chain) {
  return new Promise<Chain>((resolve, reject) => {
    if (!web3Modal.value) init()

    const unwatch = watch(
      () => chain.value,
      (changedChain) => {
        unwatch()
        if (changedChain.id === newChain.id) {
          resolve(changedChain)
        } else {
          reject(new Error('Chain switch failed'))
        }
      }
    )

    wcState.client?.switchNetwork({ chainId: newChain.id }).catch((e) => {
      reject(e)
    })
  })
}

export async function selectChain() {
  if (!web3Modal.value) init()

  await web3Modal.value?.openModal({
    route: 'SelectNetwork'
  })
}
