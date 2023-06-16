import {state as optionsState} from './options'

export function $log(...args: any[]) {
    if (optionsState.logEnabled) {
        console.log('[WC]', ...args)
    }
}
