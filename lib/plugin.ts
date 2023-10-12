import type { Plugin } from 'vue'

import { state as optionsState, setOptions } from './options'
import type { Options } from './types'
import { init } from './wc'

export function createWeb3Auth(options: Options): Plugin {
  return {
    install() {
      setOptions(options)
      if (optionsState.autoInit) {
        init()
      }
    }
  }
}
