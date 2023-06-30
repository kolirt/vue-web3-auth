import type { Chain } from '@wagmi/core';
import * as Chains from '@wagmi/core/chains';
import type { ComputedRef } from 'vue';
import type { FetchBalanceResult } from '@wagmi/core';
import type { FetchFeeDataResult } from '@wagmi/core';
import type { FetchTokenResult } from '@wagmi/core';
import type { Plugin as Plugin_2 } from 'vue';
import type { Ref } from 'vue';
import type { ThemeCtrlState } from '@web3modal/core';
import type { Transaction } from 'viem';
import type { TransactionReceipt } from 'viem/src/types/transaction';
import type { TransactionReceipt as TransactionReceipt_2 } from 'viem';
import type { Unit } from '@wagmi/core';
import type { WaitForTransactionResult } from '@wagmi/core';

export declare function $off(event: Events, callback: (...args: any) => void): void;

export declare function $on(event: Events, callback: (...args: any) => void): void;

export declare const account: {
    connected: boolean;
    address?: `0x${string}` | undefined;
    shortAddress?: string | undefined;
};

export declare function accountDetails(): Promise<void>;

declare type BlockTag = 'latest' | 'earliest' | 'pending' | 'safe' | 'finalized';

export { Chain }

export declare const chain: ComputedRef<Chain>;

export { Chains }

export declare function connect(chain?: Chain): Promise<void>;

export declare function createWeb3Auth(options: Options): Plugin_2;

declare type DecodedEvent = {
    eventName: string;
    args: [] | {};
};

export declare function disconnect(): Promise<void>;

export declare const erc20ABI: ({
    inputs: {
        internalType: string;
        name: string;
        type: string;
    }[];
    stateMutability: string;
    type: string;
    anonymous?: undefined;
    name?: undefined;
    outputs?: undefined;
} | {
    anonymous: boolean;
    inputs: {
        indexed: boolean;
        internalType: string;
        name: string;
        type: string;
    }[];
    name: string;
    type: string;
    stateMutability?: undefined;
    outputs?: undefined;
} | {
    inputs: {
        internalType: string;
        name: string;
        type: string;
    }[];
    name: string;
    outputs: {
        internalType: string;
        name: string;
        type: string;
    }[];
    stateMutability: string;
    type: string;
    anonymous?: undefined;
})[];

export declare function estimateWriteContractGas(data: WriteContract): Promise<bigint>;

export declare enum Events {
    Connected = "connected",
    Disconnected = "disconnect",
    ChainSwitched = "chain_switched",
    UnknownChain = "unknown_chain",
    ModalStateChanged = "modal_state_changed"
}

declare type FetchBalance = {
    chainId?: number;
    address: `0x${string}`;
    formatUnits?: Unit;
    token?: `0x${string}`;
};

export declare function fetchBalance(data: FetchBalance): Promise<FetchBalanceResult>;

declare type FetchBalanceOptions = {
    disableAutoFetch?: boolean;
    autoReloadTime?: number;
    disableAutoReload?: boolean;
};

declare type FetchBlockNumber = {
    chainId?: number;
};

export declare function fetchBlockNumber(data?: FetchBlockNumber): Promise<bigint>;

declare type FetchFeeData = {
    chainId?: number;
    formatUnits?: Unit;
};

export declare function fetchGasPrice(data?: FetchFeeData): Promise<FetchFeeDataResult>;

declare type FetchToken = {
    chainId?: number;
    address: `0x${string}`;
    formatUnits?: Unit;
};

export declare function fetchToken(data: FetchToken): Promise<FetchTokenResult>;

declare type FetchTransaction = {
    chainId?: number;
    hash: `0x${string}`;
};

export declare function fetchTransaction(data: FetchTransaction): Promise<Transaction>;

declare type FetchTransactionReceipt = {
    chainId?: number;
    hash: `0x${string}`;
};

export declare function fetchTransactionReceipt(data: FetchTransactionReceipt): Promise<TransactionReceipt_2>;

export declare function getAvailableChains(): Chain[];

export declare function init(): void;

export declare function multicall(params: MulticallArgs): Promise<unknown[]>;

export declare const multicallABI: ({
    inputs: {
        components: {
            internalType: string;
            name: string;
            type: string;
        }[];
        internalType: string;
        name: string;
        type: string;
    }[];
    name: string;
    outputs: {
        internalType: string;
        name: string;
        type: string;
    }[];
    stateMutability: string;
    type: string;
} | {
    inputs: {
        internalType: string;
        name: string;
        type: string;
    }[];
    name: string;
    outputs: {
        internalType: string;
        name: string;
        type: string;
    }[];
    stateMutability: string;
    type: string;
})[];

declare type MulticallArgs = {
    chainId?: number;
    calls: MulticallContract[];
    multicallAddress?: `0x${string}`;
    batchSize?: number;
    allowFailure?: boolean;
} & ({
    blockNumber?: bigint;
    blockTag?: never;
} | {
    blockNumber?: never;
    blockTag?: BlockTag;
});

declare type MulticallContract = {
    abi: any;
    contractAddress: string;
    calls: [string, Array<any>?][];
};

export declare type Options = {
    /**
     * if true, plugin WalletConnect will init automatically
     */
    autoInit?: boolean;
    /**
     * generate here https://cloud.walletconnect.com/ and turn on 'Supports Sign v2'
     */
    projectId: string;
    chains: Chain[];
    /**
     * if true, wc will auto connect if was connected previously
     */
    autoConnect?: boolean;
    /**
     * when selected unknown chain, account will disconnect
     */
    disconnectUnknownChain?: boolean;
    /**
     * when chain changed account will disconnect then connect again. when true, event "chain_switched" isn't available
     */
    reconnectToChain?: boolean;
    logEnabled?: boolean;
    /**
     * if true, the w3m provider will be disabled and a custom rpc based on the rpc from the chain configuration will be activated
     */
    enableCustomProvider?: boolean;
    web3modalOptions?: ThemeCtrlState;
};

declare type ParseEvents = {
    abi: any;
};

export declare function parseEvents(data: ParseEvents, transactionReceipt: TransactionReceipt): DecodedEvent[];

declare type ReadContract = {
    chainId?: number;
    address: `0x${string}`;
    abi: any;
    functionName: string;
    args?: any[];
    account?: `0x${string}`;
    blockNumber?: bigint;
    blockTag?: BlockTag;
};

export declare function readContract(data: ReadContract): Promise<unknown[]>;

export declare function selectChain(): Promise<void>;

declare type SendTransaction = {
    chainId?: number;
    to: string;
    account?: `0x${string}`;
    gas?: bigint;
    gasPrice?: bigint;
    maxFeePerGas?: bigint;
    maxPriorityFeePerGas?: bigint;
    nonce?: number;
    value?: bigint;
    confirmations?: number;
};

export declare function sendTransaction(data: SendTransaction): Promise<TransactionReceipt_2>;

export declare function shortAddressFilter(value?: string): string;

export declare function signMessage(message: string): Promise<`0x${string}`>;

export declare function switchChain(newChain: Chain): Promise<void>;

export declare function useFetchBalance(params: FetchBalance, options?: FetchBalanceOptions): {
    loaded: Ref<boolean>;
    fetching: Ref<boolean>;
    data: {
        decimals: number;
        formatted: string;
        symbol: string;
        value: bigint;
    };
    fetch: () => Promise<void>;
    reload: () => Promise<void>;
    disableAutoReload: () => void;
};

declare type WatchContractEvent = {
    chainId?: number;
    address: `0x${string}` | `0x${string}`[];
    abi: any;
    eventName: string;
};

export declare function watchContractEvent(data: WatchContractEvent, callback: (log: any) => void): () => void;

declare type WriteContract = {
    chainId?: number;
    address: `0x${string}`;
    abi: any;
    functionName: string;
    args?: any[];
    account?: `0x${string}`;
    gas?: bigint;
    gasPrice?: bigint;
    maxFeePerGas?: bigint;
    maxPriorityFeePerGas?: bigint;
    nonce?: number;
    value?: bigint;
    confirmations?: number;
};

export declare function writeContract(data: WriteContract): Promise<{
    hash: `0x${string}`;
    wait: () => Promise<WaitForTransactionResult>;
}>;

export { }
