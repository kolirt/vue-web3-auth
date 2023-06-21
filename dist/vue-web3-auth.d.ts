import type { BlockTag } from 'viem/src/types/block';
import type { Chain } from '@wagmi/core';
import * as Chains from '@wagmi/core/chains';
import type { ComputedRef } from 'vue';
import type { FetchBalanceResult } from '@wagmi/core';
import type { FetchFeeDataResult } from '@wagmi/core';
import type { FetchTokenResult } from '@wagmi/core';
import type { Plugin as Plugin_2 } from 'vue';
import type { ThemeCtrlState } from '@web3modal/core';
import type { TransactionReceipt } from 'viem';
import type { Unit } from '@wagmi/core';

export declare function $off(event: Events, callback: (...args: any) => void): void;

export declare function $on(event: Events, callback: (...args: any) => void): void;

export declare const account: {
    connected: boolean;
    address?: `0x${string}` | undefined;
    shortAddress?: string | undefined;
};

export declare function accountDetails(): Promise<void>;

export { Chain }

export declare const chain: ComputedRef<Chain>;

export { Chains }

export declare function connect(chain?: Chain): Promise<void>;

export declare function createWeb3Auth(options: Options): Plugin_2;

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

export declare function getAvailableChains(): Chain[];

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
    autoInit?: boolean;
    projectId: string;
    chains: Chain[];
    autoConnect?: boolean;
    disconnectUnknownChain?: boolean;
    reconnectToChain?: boolean;
    logEnabled?: boolean;
    web3modalOptions?: ThemeCtrlState;
};

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

export declare function shortAddressFilter(value?: string): string;

export declare function switchChain(newChain: Chain): Promise<void>;

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

export declare function writeContract(data: WriteContract): Promise<TransactionReceipt>;

export { }
