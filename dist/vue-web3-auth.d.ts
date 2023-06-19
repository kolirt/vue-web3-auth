import type { BlockTag } from 'viem/src/types/block';
import type { Chain } from '@wagmi/core';
import * as Chains from '@wagmi/core/chains';
import type { ComputedRef } from 'vue';
import MulticallAbi from './utils/abi/multicall.json';
import type { Plugin as Plugin_2 } from 'vue';
import type { ThemeCtrlState } from '@web3modal/core';

export declare function $off(event: Event_2, callback: (...args: any) => void): void;

export declare function $on(event: Event_2, callback: (...args: any) => void): void;

export declare const account: {
    connected: boolean;
    address?: string | undefined;
    shortAddress?: string | undefined;
};

export declare function accountDetails(): Promise<void>;

export { Chain }

export declare const chain: ComputedRef<Chain>;

export { Chains }

export declare function connect(chain?: Chain): Promise<void>;

export declare function createWeb3Auth(options: Options): Plugin_2;

export declare function disconnect(): Promise<void>;

declare enum Event_2 {
    Connected = "connected",
    Disconnected = "disconnect",
    ChainSwitched = "chain_switched",
    UnknownChain = "unknown_chain",
    ModalStateChanged = "modal_state_changed"
}
export { Event_2 as Event }

export declare function getAvailableChains(): Chain[];

export declare function multicall(params: MulticallArgs): Promise<unknown[]>;

export { MulticallAbi }

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

export declare function selectChain(): Promise<void>;

export declare function shortAddressFilter(value?: string): string;

export declare function switchChain(newChain: Chain): Promise<void>;

export { }
