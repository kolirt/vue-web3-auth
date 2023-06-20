import {Ref, ref} from 'vue'
import {Web3Modal} from '@web3modal/html'
import {ModalCtrlState, ThemeCtrlState} from '@web3modal/core/dist/_types/src/types/controllerTypes'
import {$emit} from './event'
import {state as optionsState, setOptions} from './options'
import {Events} from './enums'
import {EthereumClient} from '@web3modal/ethereum'

export const web3Modal: Ref<Web3Modal | null> = ref(null)

export function setTheme(web3modalOptions: ThemeCtrlState) {
    setOptions({web3modalOptions})

    web3Modal.value?.setTheme({
        themeMode: optionsState.web3modalOptions?.themeMode,
        themeVariables: optionsState.web3modalOptions?.themeVariables
    })
}

export function initWeb3Modal(ethereumClient: EthereumClient) {
    web3Modal.value = new Web3Modal(
        {
            projectId: optionsState.projectId,
            ...(optionsState?.web3modalOptions || [])
        },
        ethereumClient
    )

    web3Modal.value?.subscribeModal(({open}: ModalCtrlState) => {
        $emit(Events.ModalStateChanged, open)
    })
}