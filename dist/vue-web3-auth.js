import * as ne from "@wagmi/core/chains";
import { configureChains as k, createConfig as I, watchNetwork as M, watchAccount as $, disconnect as P, fetchBalance as x, fetchBlockNumber as E, readContract as F, writeContract as N, waitForTransaction as C, getPublicClient as U, watchContractEvent as G, fetchFeeData as S, signMessage as D, multicall as _, fetchToken as j, fetchTransaction as A, sendTransaction as H } from "@wagmi/core";
import { reactive as h, toRaw as f, watch as w, ref as V, computed as W } from "vue";
import { Web3Modal as L } from "@web3modal/html";
import R from "js-event-bus";
import { w3mProvider as z, w3mConnectors as q, EthereumClient as J } from "@web3modal/ethereum";
var K = {
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
const Q = K, t = h({
  autoInit: !0,
  projectId: "",
  chains: [Q],
  autoConnect: !0,
  disconnectUnknownChain: !0,
  reconnectToChain: !0,
  logEnabled: !1,
  web3modalOptions: {
    themeMode: "light",
    themeVariables: {}
  }
});
function X(e) {
  "autoInit" in e && (t.autoInit = e.autoInit), "projectId" in e && (t.projectId = e.projectId), "chains" in e && (t.chains = e.chains), "autoConnect" in e && (t.autoConnect = e.autoConnect), "disconnectUnknownChain" in e && (t.disconnectUnknownChain = e.disconnectUnknownChain), "reconnectToChain" in e && (t.reconnectToChain = e.reconnectToChain), "logEnabled" in e && (t.logEnabled = e.logEnabled), "web3modalOptions" in e && ("themeMode" in e.web3modalOptions && (t.web3modalOptions.themeMode = e.web3modalOptions.themeMode), "themeVariables" in e.web3modalOptions && (t.web3modalOptions.themeVariables = e.web3modalOptions.themeVariables));
}
function l(...e) {
  t.logEnabled && console.log("[WC]", ...e);
}
var s = /* @__PURE__ */ ((e) => (e.Connected = "connected", e.Disconnected = "disconnect", e.ChainSwitched = "chain_switched", e.UnknownChain = "unknown_chain", e.ModalStateChanged = "modal_state_changed", e))(s || {});
let g;
const v = h({
  client: null
});
function y(e) {
  return String(e).toLowerCase();
}
async function Y([e, n], [a, i]) {
  if (t.disconnectUnknownChain && (!a && t.disconnectUnknownChain || a) && n && !t.chains.some((p) => p.id === n.id)) {
    await O(), i && (d(s.Disconnected), l(`account ${e.address} disconnected from ${y(i.name)} chain.`)), d(s.UnknownChain, { chain: n }), l("switched to unsupported chain.");
    return;
  }
  (a == null ? void 0 : a.address) !== (e == null ? void 0 : e.address) && !(i != null && i.unsupported) && (a && (d(s.Disconnected), l(`account ${a.address} disconnected from ${y(i.name)} chain.`)), e && (d(s.Connected, { chain: r.bufferChain, account: m.bufferAccount }), l(`account ${e.address} connected to ${y(n.name)} chain.`))), i && n && i.id !== n.id && (t.reconnectToChain ? (d(s.Disconnected), l(`account ${a.address} disconnected from ${y(i.name)} chain.`), d(s.Connected, { chain: r.bufferChain, account: m.bufferAccount }), l(`account ${e.address} connected to ${y(n.name)} chain.`)) : (d(s.ChainSwitched, { chain: n }), l(`account ${e.address} switched to ${y(n.name)} chain.`)));
}
function Z([e, n], [a, i]) {
  clearTimeout(g), g = setTimeout(Y, 200, [e, n], [a, i]);
}
function b() {
  if (o.value)
    return;
  const { publicClient: e } = k(f(t.chains), [z({ projectId: t.projectId })]), n = I({
    autoConnect: t.autoConnect,
    connectors: q({
      projectId: t.projectId,
      version: 2,
      chains: f(t.chains)
    }),
    publicClient: e
  });
  M((i) => {
    var p;
    (p = i.chain) != null && p.unsupported && (i.chain.name = "Unsupported"), r.bufferChain = i.chain || null;
  }), $((i) => {
    m.bufferAccount = i.address ? i : null;
  }), w([() => m.bufferAccount, () => r.bufferChain], Z);
  const a = new J(n, f(t.chains));
  v.client = a, ee(a);
}
const m = h({
  bufferAccount: null,
  currentAccount: null
}), u = h({
  connected: !1,
  address: void 0,
  shortAddress: void 0
});
async function O() {
  await P();
}
async function oe(e) {
  var n, a;
  o.value || b(), e instanceof Event && (e = t.chains[0]), (n = o.value) == null || n.setDefaultChain(e || t.chains[0]), await ((a = o.value) == null ? void 0 : a.openModal({
    route: "ConnectWallet"
  }));
}
async function re() {
  var e;
  o.value || b(), await ((e = o.value) == null ? void 0 : e.openModal({
    route: "Account"
  }));
}
function B(e = "") {
  return `${e.slice(0, 5)}...${e.slice(-4)}`;
}
w(() => m.currentAccount, (e) => {
  e ? (u.connected = !0, u.address = e.address, u.shortAddress = B(e.address)) : (u.connected = !1, u.address = void 0, u.shortAddress = void 0);
});
const T = new R();
function d(e, ...n) {
  e === s.Connected || e === s.Disconnected ? (r.currentChain = r.bufferChain, m.currentAccount = m.bufferAccount) : e === s.ChainSwitched && (r.currentChain = r.bufferChain), T.emit(e, null, ...n);
}
function le(e, n) {
  T.on(e, n), t.logEnabled && l(`Subscribe for ${e} event.`);
}
function ue(e, n) {
  T.detach(e, n), t.logEnabled && l(`Unsubscribe for ${e} event.`);
}
const o = V(null);
function ee(e) {
  var n;
  o.value = new L(
    {
      projectId: t.projectId,
      ...(t == null ? void 0 : t.web3modalOptions) || []
    },
    e
  ), (n = o.value) == null || n.subscribeModal(({ open: a }) => {
    d(s.ModalStateChanged, a);
  });
}
const r = h({
  bufferChain: null,
  currentChain: null
}), c = W(() => r.currentChain ? r.currentChain : t.chains[0]);
function de() {
  return t.chains;
}
async function me(e) {
  var n;
  o.value || b(), await ((n = v.client) == null ? void 0 : n.switchNetwork({ chainId: e.id }));
}
async function pe() {
  var e;
  o.value || b(), await ((e = o.value) == null ? void 0 : e.openModal({
    route: "SelectNetwork"
  }));
}
function ye(e) {
  return x({
    chainId: e.chainId || c.value.id,
    address: e.address,
    token: e.token,
    formatUnits: e.formatUnits
  });
}
function he(e) {
  return E({
    chainId: (e == null ? void 0 : e.chainId) || c.value.id
  });
}
async function be(e) {
  return F({
    chainId: e.chainId || c.value.id,
    address: e.address,
    abi: e.abi,
    functionName: e.functionName,
    args: e.args || [],
    account: e.account || u.address,
    blockNumber: e.blockNumber,
    blockTag: e.blockTag
  });
}
async function fe(e) {
  const { hash: n } = await N({
    chainId: e.chainId || c.value.id,
    address: e.address,
    abi: e.abi,
    functionName: e.functionName,
    args: e.args || [],
    account: e.account || u.address,
    gas: e.gas,
    gasPrice: e.gasPrice,
    maxFeePerGas: e.maxFeePerGas,
    maxPriorityFeePerGas: e.maxPriorityFeePerGas,
    nonce: e.nonce,
    value: e.value
  });
  return C({
    chainId: e.chainId || c.value.id,
    hash: n,
    confirmations: e.confirmations || 1
  });
}
async function Te(e) {
  return await U({ chainId: e.chainId || c.value.id }).estimateContractGas({
    address: e.address,
    abi: e.abi,
    functionName: e.functionName,
    args: e.args || [],
    // @ts-ignore
    account: e.account || u.address,
    gasPrice: e.gasPrice,
    maxFeePerGas: e.maxFeePerGas,
    maxPriorityFeePerGas: e.maxPriorityFeePerGas,
    nonce: e.nonce,
    value: e.value
  });
}
function ge(e, n) {
  return G({
    chainId: (e == null ? void 0 : e.chainId) || c.value.id,
    address: e.address,
    abi: e.abi,
    eventName: e.eventName
  }, n);
}
function Ce(e) {
  return S({
    chainId: (e == null ? void 0 : e.chainId) || c.value.id,
    formatUnits: e == null ? void 0 : e.formatUnits
  });
}
function we(e) {
  return D({
    message: e
  });
}
async function ve(e) {
  const n = [];
  return e.calls.forEach((a) => {
    a.calls.forEach(([i, p]) => {
      n.push({
        address: a.contractAddress,
        abi: a.abi,
        functionName: i,
        args: p
      });
    });
  }), await _({
    chainId: e.chainId,
    contracts: n,
    multicallAddress: e.multicallAddress,
    blockTag: e.blockTag,
    blockNumber: e.blockNumber,
    batchSize: e.batchSize,
    allowFailure: e.allowFailure
  });
}
function ke(e) {
  return j({
    chainId: e.chainId || c.value.id,
    address: e.address,
    formatUnits: e.formatUnits
  });
}
function Ie(e) {
  return A({
    chainId: e.chainId || c.value.id,
    hash: e.hash
  });
}
async function Me(e) {
  const { hash: n } = await H({
    chainId: e.chainId || c.value.id,
    to: e.to,
    account: e.account,
    gas: e.gas,
    gasPrice: e.gasPrice,
    maxFeePerGas: e.maxFeePerGas,
    maxPriorityFeePerGas: e.maxPriorityFeePerGas,
    nonce: e.nonce,
    value: e.value
  });
  return C({
    chainId: e.chainId || c.value.id,
    hash: n,
    confirmations: e.confirmations || 1
  });
}
const $e = [
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
], Pe = [
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
function xe(e) {
  return {
    install() {
      X(e), b();
    }
  };
}
export {
  ue as $off,
  le as $on,
  ne as Chains,
  s as Events,
  u as account,
  re as accountDetails,
  c as chain,
  oe as connect,
  xe as createWeb3Auth,
  O as disconnect,
  $e as erc20ABI,
  Te as estimateWriteContractGas,
  ye as fetchBalance,
  he as fetchBlockNumber,
  Ce as fetchGasPrice,
  ke as fetchToken,
  Ie as fetchTransaction,
  de as getAvailableChains,
  b as init,
  ve as multicall,
  Pe as multicallABI,
  be as readContract,
  pe as selectChain,
  Me as sendTransaction,
  B as shortAddressFilter,
  we as signMessage,
  me as switchChain,
  ge as watchContractEvent,
  fe as writeContract
};
