import EventBus from 'js-event-bus'
import {state as chainState} from './chain'
import {state as accountState} from './account'
import {state as optionsState} from './options'
import {$log} from './log'
import {Event} from './enums'

const eventBus = new EventBus

export function $emit(event: Event, ...args: any[]) {
    if (event === Event.Connected || event === Event.Disconnected) {
        chainState.currentChain = chainState.bufferChain
        accountState.currentAccount = accountState.bufferAccount
    } else if (event === Event.ChainSwitched) {
        chainState.currentChain = chainState.bufferChain
    }

    eventBus.emit(event, null, ...args)
}

export function $on(event: Event, callback: (...args: any) => void) {
    eventBus.on(event, callback)
    if (optionsState.logEnabled) {
        $log(`Subscribe for ${event} event.`)
    }
}

export function $off(event: Event, callback: (...args: any) => void) {
    eventBus.detach(event, callback)
    if (optionsState.logEnabled) {
        $log(`Unsubscribe for ${event} event.`)
    }
}