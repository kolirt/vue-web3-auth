import * as Z from "@wagmi/core/chains";
import { reactive as h, computed as w, ref as v, watch as g, toRaw as f } from "vue";
import { disconnect as I, configureChains as M, createConfig as $, watchNetwork as x, watchAccount as P, fetchBalance as N, fetchBlockNumber as U, fetchToken as E, readContract as F, writeContract as S, waitForTransaction as D, getPublicClient as G, fetchFeeData as _, multicall as j } from "@wagmi/core";
import { w3mProvider as A, w3mConnectors as H, EthereumClient as V } from "@web3modal/ethereum";
import { Web3Modal as W } from "@web3modal/html";
import L from "js-event-bus";
var R = {
  id: 1,
  network: "homestead",
  name: "Ethereum",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    alchemy: {
      http: ["https://eth-mainnet.g.alchemy.com/v2"],
      webSocket: ["wss://eth-mainnet.g.alchemy.com/v2"]
    },
    infura: {
      http: ["https://mainnet.infura.io/v3"],
      webSocket: ["wss://mainnet.infura.io/ws/v3"]
    },
    default: {
      http: ["https://cloudflare-eth.com"]
    },
    public: {
      http: ["https://cloudflare-eth.com"]
    }
  },
  blockExplorers: {
    etherscan: {
      name: "Etherscan",
      url: "https://etherscan.io"
    },
    default: {
      name: "Etherscan",
      url: "https://etherscan.io"
    }
  },
  contracts: {
    ensRegistry: {
      address: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e"
    },
    ensUniversalResolver: {
      address: "0xc0497E381f536Be9ce14B0dD3817cBcAe57d2F62",
      blockCreated: 16966585
    },
    multicall3: {
      address: "0xca11bde05977b3631167028862be2a173976ca11",
      blockCreated: 14353601
    }
  }
};
const z = R, t = h({
  autoInit: !0,
  projectId: "",
  chains: [z],
  autoConnect: !0,
  disconnectUnknownChain: !0,
  reconnectToChain: !0,
  logEnabled: !1,
  web3modalOptions: {
    themeMode: "light",
    themeVariables: {}
  }
});
function q(e) {
  "autoInit" in e && (t.autoInit = e.autoInit), "projectId" in e && (t.projectId = e.projectId), "chains" in e && (t.chains = e.chains), "autoConnect" in e && (t.autoConnect = e.autoConnect), "disconnectUnknownChain" in e && (t.disconnectUnknownChain = e.disconnectUnknownChain), "reconnectToChain" in e && (t.reconnectToChain = e.reconnectToChain), "logEnabled" in e && (t.logEnabled = e.logEnabled), "web3modalOptions" in e && ("themeMode" in e.web3modalOptions && (t.web3modalOptions.themeMode = e.web3modalOptions.themeMode), "themeVariables" in e.web3modalOptions && (t.web3modalOptions.themeVariables = e.web3modalOptions.themeVariables));
}
const o = h({
  bufferChain: null,
  currentChain: null
}), d = w(() => o.currentChain ? o.currentChain : t.chains[0]);
function ae() {
  return t.chains;
}
async function ie(e) {
  var n;
  c.value || b(), await ((n = k.client) == null ? void 0 : n.switchNetwork({ chainId: e.id }));
}
async function se() {
  var e;
  c.value || b(), await ((e = c.value) == null ? void 0 : e.openModal({
    route: "SelectNetwork"
  }));
}
function r(...e) {
  t.logEnabled && console.log("[WC]", ...e);
}
var s = /* @__PURE__ */ ((e) => (e.Connected = "connected", e.Disconnected = "disconnect", e.ChainSwitched = "chain_switched", e.UnknownChain = "unknown_chain", e.ModalStateChanged = "modal_state_changed", e))(s || {});
const T = new L();
function u(e, ...n) {
  e === s.Connected || e === s.Disconnected ? (o.currentChain = o.bufferChain, p.currentAccount = p.bufferAccount) : e === s.ChainSwitched && (o.currentChain = o.bufferChain), T.emit(e, null, ...n);
}
function ce(e, n) {
  T.on(e, n), t.logEnabled && r(`Subscribe for ${e} event.`);
}
function oe(e, n) {
  T.detach(e, n), t.logEnabled && r(`Unsubscribe for ${e} event.`);
}
const c = v(null);
function J(e) {
  var n;
  c.value = new W(
    {
      projectId: t.projectId,
      ...(t == null ? void 0 : t.web3modalOptions) || []
    },
    e
  ), (n = c.value) == null || n.subscribeModal(({ open: a }) => {
    u(s.ModalStateChanged, a);
  });
}
const p = h({
  bufferAccount: null,
  currentAccount: null
}), l = h({
  connected: !1,
  address: void 0,
  shortAddress: void 0
});
async function K() {
  await I();
}
async function re(e) {
  var n, a;
  c.value || b(), e instanceof Event && (e = t.chains[0]), (n = c.value) == null || n.setDefaultChain(e || t.chains[0]), await ((a = c.value) == null ? void 0 : a.openModal({
    route: "ConnectWallet"
  }));
}
async function le() {
  var e;
  c.value || b(), await ((e = c.value) == null ? void 0 : e.openModal({
    route: "Account"
  }));
}
function Q(e = "") {
  return `${e.slice(0, 5)}...${e.slice(-4)}`;
}
g(() => p.currentAccount, (e) => {
  e ? (l.connected = !0, l.address = e.address, l.shortAddress = Q(e.address)) : (l.connected = !1, l.address = void 0, l.shortAddress = void 0);
});
let C;
const k = h({
  client: null
});
function y(e) {
  return String(e).toLowerCase();
}
async function X([e, n], [a, i]) {
  if (t.disconnectUnknownChain && (!a && t.disconnectUnknownChain || a) && n && !t.chains.some((m) => m.id === n.id)) {
    await K(), i && (u(s.Disconnected), r(`account ${e.address} disconnected from ${y(i.name)} chain.`)), u(s.UnknownChain, { chain: n }), r("switched to unsupported chain.");
    return;
  }
  (a == null ? void 0 : a.address) !== (e == null ? void 0 : e.address) && !(i != null && i.unsupported) && (a && (u(s.Disconnected), r(`account ${a.address} disconnected from ${y(i.name)} chain.`)), e && (u(s.Connected, { chain: o.bufferChain, account: p.bufferAccount }), r(`account ${e.address} connected to ${y(n.name)} chain.`))), i && n && i.id !== n.id && (t.reconnectToChain ? (u(s.Disconnected), r(`account ${a.address} disconnected from ${y(i.name)} chain.`), u(s.Connected, { chain: o.bufferChain, account: p.bufferAccount }), r(`account ${e.address} connected to ${y(n.name)} chain.`)) : (u(s.ChainSwitched, { chain: n }), r(`account ${e.address} switched to ${y(n.name)} chain.`)));
}
function Y([e, n], [a, i]) {
  clearTimeout(C), C = setTimeout(X, 200, [e, n], [a, i]);
}
function b() {
  if (c.value)
    return;
  const { publicClient: e } = M(f(t.chains), [A({ projectId: t.projectId })]), n = $({
    autoConnect: t.autoConnect,
    connectors: H({
      projectId: t.projectId,
      version: 2,
      chains: f(t.chains)
    }),
    publicClient: e
  });
  x((i) => {
    var m;
    (m = i.chain) != null && m.unsupported && (i.chain.name = "Unsupported"), o.bufferChain = i.chain || null;
  }), P((i) => {
    p.bufferAccount = i.address ? i : null;
  }), g([() => p.bufferAccount, () => o.bufferChain], Y);
  const a = new V(n, f(t.chains));
  k.client = a, J(a);
}
function ue(e) {
  return {
    install() {
      q(e), b();
    }
  };
}
function de(e) {
  return N({
    chainId: e.chainId || d.value.id,
    address: e.address,
    token: e.token,
    formatUnits: e.formatUnits
  });
}
function pe(e) {
  return U({
    chainId: (e == null ? void 0 : e.chainId) || d.value.id
  });
}
function me(e) {
  return E({
    chainId: e.chainId || d.value.id,
    address: e.address,
    formatUnits: e.formatUnits
  });
}
async function ye(e) {
  return F({
    chainId: e.chainId || d.value.id,
    address: e.address,
    abi: e.abi,
    functionName: e.functionName,
    args: e.args || [],
    account: e.account || l.address,
    blockNumber: e.blockNumber,
    blockTag: e.blockTag
  });
}
async function he(e) {
  const { hash: n } = await S({
    chainId: e.chainId || d.value.id,
    address: e.address,
    abi: e.abi,
    functionName: e.functionName,
    args: e.args || [],
    account: e.account || l.address,
    gas: e.gas,
    gasPrice: e.gasPrice,
    maxFeePerGas: e.maxFeePerGas,
    maxPriorityFeePerGas: e.maxPriorityFeePerGas,
    nonce: e.nonce,
    value: e.value
  });
  return D({
    chainId: e.chainId || d.value.id,
    hash: n,
    confirmations: e.confirmations || 1
  });
}
async function be(e) {
  return await G({ chainId: e.chainId || d.value.id }).estimateContractGas({
    address: e.address,
    abi: e.abi,
    functionName: e.functionName,
    args: e.args || [],
    // @ts-ignore
    account: e.account || l.address,
    gasPrice: e.gasPrice,
    maxFeePerGas: e.maxFeePerGas,
    maxPriorityFeePerGas: e.maxPriorityFeePerGas,
    nonce: e.nonce,
    value: e.value
  });
}
function fe(e) {
  return _({
    chainId: (e == null ? void 0 : e.chainId) || d.value.id,
    formatUnits: e == null ? void 0 : e.formatUnits
  });
}
async function Te(e) {
  const n = [];
  return e.calls.forEach((a) => {
    a.calls.forEach(([i, m]) => {
      n.push({
        address: a.contractAddress,
        abi: a.abi,
        functionName: i,
        args: m
      });
    });
  }), await j({
    chainId: e.chainId,
    contracts: n,
    multicallAddress: e.multicallAddress,
    blockTag: e.blockTag,
    blockNumber: e.blockNumber,
    batchSize: e.batchSize,
    allowFailure: e.allowFailure
  });
}
const Ce = [
  {
    inputs: [
      { internalType: "string", name: "name_", type: "string" },
      {
        internalType: "string",
        name: "symbol_",
        type: "string"
      },
      { internalType: "uint8", name: "decimals_", type: "uint8" },
      {
        internalType: "uint256",
        name: "initialBalance_",
        type: "uint256"
      },
      { internalType: "address payable", name: "feeReceiver_", type: "address" }
    ],
    stateMutability: "payable",
    type: "constructor"
  },
  {
    anonymous: !1,
    inputs: [
      { indexed: !0, internalType: "address", name: "owner", type: "address" },
      {
        indexed: !0,
        internalType: "address",
        name: "spender",
        type: "address"
      },
      { indexed: !1, internalType: "uint256", name: "value", type: "uint256" }
    ],
    name: "Approval",
    type: "event"
  },
  {
    anonymous: !1,
    inputs: [
      { indexed: !0, internalType: "address", name: "from", type: "address" },
      {
        indexed: !0,
        internalType: "address",
        name: "to",
        type: "address"
      },
      { indexed: !1, internalType: "uint256", name: "value", type: "uint256" }
    ],
    name: "Transfer",
    type: "event"
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      {
        internalType: "address",
        name: "spender",
        type: "address"
      }
    ],
    name: "allowance",
    outputs: [
      { internalType: "uint256", name: "", type: "uint256" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256"
      }
    ],
    name: "approve",
    outputs: [
      { internalType: "bool", name: "", type: "bool" }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "account", type: "address" }
    ],
    name: "balanceOf",
    outputs: [
      { internalType: "uint256", name: "", type: "uint256" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      { internalType: "uint8", name: "", type: "uint8" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256"
      }
    ],
    name: "decreaseAllowance",
    outputs: [
      { internalType: "bool", name: "", type: "bool" }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      {
        internalType: "uint256",
        name: "addedValue",
        type: "uint256"
      }
    ],
    name: "increaseAllowance",
    outputs: [
      { internalType: "bool", name: "", type: "bool" }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      { internalType: "string", name: "", type: "string" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      { internalType: "string", name: "", type: "string" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      { internalType: "uint256", name: "", type: "uint256" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "recipient", type: "address" },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256"
      }
    ],
    name: "transfer",
    outputs: [
      { internalType: "bool", name: "", type: "bool" }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "sender", type: "address" },
      {
        internalType: "address",
        name: "recipient",
        type: "address"
      },
      { internalType: "uint256", name: "amount", type: "uint256" }
    ],
    name: "transferFrom",
    outputs: [
      { internalType: "bool", name: "", type: "bool" }
    ],
    stateMutability: "nonpayable",
    type: "function"
  }
], ge = [
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "target",
            type: "address"
          },
          {
            internalType: "bytes",
            name: "callData",
            type: "bytes"
          }
        ],
        internalType: "struct Multicall.Call[]",
        name: "calls",
        type: "tuple[]"
      }
    ],
    name: "aggregate",
    outputs: [
      {
        internalType: "uint256",
        name: "blockNumber",
        type: "uint256"
      },
      {
        internalType: "bytes[]",
        name: "returnData",
        type: "bytes[]"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "blockNumber",
        type: "uint256"
      }
    ],
    name: "getBlockHash",
    outputs: [
      {
        internalType: "bytes32",
        name: "blockHash",
        type: "bytes32"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "getCurrentBlockCoinbase",
    outputs: [
      {
        internalType: "address",
        name: "coinbase",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "getCurrentBlockDifficulty",
    outputs: [
      {
        internalType: "uint256",
        name: "difficulty",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "getCurrentBlockGasLimit",
    outputs: [
      {
        internalType: "uint256",
        name: "gaslimit",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "getCurrentBlockTimestamp",
    outputs: [
      {
        internalType: "uint256",
        name: "timestamp",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "addr",
        type: "address"
      }
    ],
    name: "getEthBalance",
    outputs: [
      {
        internalType: "uint256",
        name: "balance",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "getLastBlockHash",
    outputs: [
      {
        internalType: "bytes32",
        name: "blockHash",
        type: "bytes32"
      }
    ],
    stateMutability: "view",
    type: "function"
  }
];
export {
  oe as $off,
  ce as $on,
  Z as Chains,
  s as Events,
  l as account,
  le as accountDetails,
  d as chain,
  re as connect,
  ue as createWeb3Auth,
  K as disconnect,
  Ce as erc20ABI,
  be as estimateWriteContractGas,
  de as fetchBalance,
  pe as fetchBlockNumber,
  fe as fetchGasPrice,
  me as fetchToken,
  ae as getAvailableChains,
  Te as multicall,
  ge as multicallABI,
  ye as readContract,
  se as selectChain,
  Q as shortAddressFilter,
  ie as switchChain,
  he as writeContract
};
