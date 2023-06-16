import type {Plugin} from 'vue'
import type {Options} from './types'
import {setOptions} from './options'
import {init} from './wc'

export function createWeb3Auth(options: Options): Plugin {
    return {
        install() {
            setOptions(options)
            init()
        }
    }
}
