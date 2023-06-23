import type {FetchBalance, FetchBalanceOptions} from '../types'
import type {FetchBalanceResult} from '@wagmi/core'
import {reactive, ref, watch} from 'vue'
import {fetchBalance as masterFetchBalance} from '@wagmi/core'
import {chain} from '../chain'

export function fetchBalance(data: FetchBalance) {
    return masterFetchBalance({
        chainId: data.chainId || chain.value.id,
        address: data.address,
        token: data.token,
        formatUnits: data.formatUnits
    })
}

export function useFetchBalance(params: FetchBalance, options?: FetchBalanceOptions) {
    const loaded = ref(false)
    const fetching = ref(false)
    const data = reactive<FetchBalanceResult>({
        decimals: 0,
        formatted: '',
        symbol: '',
        value: 0n
    })

    let timeoutHandler: number
    let updateHandler: number
    let currentChain = params.chainId || chain.value.id
    const fetchOptions: FetchBalanceOptions = {
        disableAutoFetch: options?.disableAutoFetch || false,
        autoReloadTime: options?.autoReloadTime || 30000,
        disableAutoReload: options?.disableAutoReload || false
    }

    async function fetch() {
        if (!fetching.value || !loaded.value) {
            fetching.value = true

            await fetchBalance(params)
                .then(fetchData => {
                    if (fetchData.value !== data.value || !loaded.value) {
                        data.decimals = fetchData.decimals
                        data.formatted = fetchData.formatted
                        data.symbol = fetchData.symbol
                        data.value = fetchData.value
                    }
                })
                .finally(() => {
                    loaded.value = true
                    fetching.value = false

                    runTimeout()
                })
        }
    }

    function reload() {
        clearTimeout(timeoutHandler)
        return fetch()
    }

    function disableAutoReload() {
        fetchOptions.disableAutoReload = true
    }

    function runTimeout() {
        if (fetchOptions.disableAutoReload !== true) {
            // @ts-ignore
            timeoutHandler = setTimeout(reload, fetchOptions.autoReloadTime || 30000)
        }
    }

    function resetData() {
        loaded.value = false
        data.decimals = 0
        data.formatted = ''
        data.symbol = ''
        data.value = 0n
    }

    function update() {
        clearTimeout(updateHandler)
        currentChain = chain.value.id
        resetData()
        reload()
    }

    if (fetchOptions.disableAutoFetch !== true) {
        fetch()
    }

    if (params.chainId === undefined) {
        watch(() => chain.value.id, (newChainId) => {
            if (newChainId !== currentChain) {
                // @ts-ignore
                updateHandler = setTimeout(update)
            }
        })
    }

    return {
        loaded,
        fetching,
        data,
        fetch,
        reload,
        disableAutoReload
    }
}