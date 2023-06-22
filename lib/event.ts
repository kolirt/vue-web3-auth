import EventBus from 'js-event-bus'
import {state as chainState} from './chain'
import {state as accountState} from './account'
import {state as optionsState} from './options'
import {$log} from './log'
import {Events} from './enums'

const eventBus = new EventBus

export function $emit(event: Events, ...args: any[]) {
    if (event === Events.Connected || event === Events.Disconnected) {
        chainState.currentChain = chainState.bufferChain
        accountState.currentAccount = accountState.bufferAccount
    } else if (event === Events.ChainSwitched) {
        chainState.currentChain = chainState.bufferChain
    }

    setTimeout(eventBus.emit, 0, event, null, ...args)
}

export function $on(event: Events, callback: (...args: any) => void) {
    eventBus.on(event, callback)
    if (optionsState.logEnabled) {
        $log(`Subscribe for ${event} event.`)
    }
}

export function $off(event: Events, callback: (...args: any) => void) {
    eventBus.detach(event, callback)
    if (optionsState.logEnabled) {
        $log(`Unsubscribe for ${event} event.`)
    }
}