import type { BlockTag } from 'viem/src/types/block';
import type { Chain } from '@wagmi/core';
import * as Chains from '@wagmi/core/chains';
import type { ComputedRef } from 'vue';
import type { Plugin as Plugin_2 } from 'vue';
import type { ThemeCtrlState } from '@web3modal/core';

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
    inputs: never[];
    payable: boolean;
    stateMutability: string;
    type: string;
    anonymous?: undefined;
    name?: undefined;
    constant?: undefined;
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
    payable?: undefined;
    stateMutability?: undefined;
    constant?: undefined;
    outputs?: undefined;
} | {
    constant: boolean;
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
    payable: boolean;
    stateMutability: string;
    type: string;
    anonymous?: undefined;
})[];

export declare enum Events {
    Connected = "connected",
    Disconnected = "disconnect",
    ChainSwitched = "chain_switched",
    UnknownChain = "unknown_chain",
    ModalStateChanged = "modal_state_changed"
}

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
    abi: {};
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
    chain?: number;
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

export { }
