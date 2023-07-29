import * as fe from "@wagmi/core/chains";
import { reactive as f, toRaw as R, watch as $, watchEffect as S, ref as k, computed as _ } from "vue";
import { configureChains as j, createConfig as D, watchNetwork as H, watchAccount as V, disconnect as W, fetchBalance as L, fetchBlockNumber as z, readContract as q, writeContract as J, getPublicClient as x, waitForTransaction as E, watchContractEvent as K, fetchFeeData as Q, signMessage as X, multicall as Y, fetchToken as Z, fetchTransaction as O, sendTransaction as B } from "@wagmi/core";
import { Web3Modal as ee } from "@web3modal/html";
import ne from "js-event-bus";
import { w3mProvider as te, w3mConnectors as ae, EthereumClient as ie } from "@web3modal/ethereum";
import { decodeEventLog as se } from "viem";
function ce() {
  return function(e) {
    return e.rpcUrls.public.http[0] ? {
      chain: e,
      rpcUrls: e.rpcUrls.public
    } : null;
  };
}
var oe = {
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
function re(e, n) {
  return {
    ...e,
    formatters: n == null ? void 0 : n.formatters,
    serializers: n == null ? void 0 : n.serializers
  };
}
const ue = /* @__PURE__ */ re(oe), a = f({
  autoInit: !0,
  projectId: "",
  chains: [ue],
  autoConnect: !0,
  disconnectUnknownChain: !0,
  reconnectToChain: !0,
  logEnabled: !1,
  enableCustomProvider: !1,
  web3modalOptions: {
    themeMode: "light",
    themeVariables: {}
  }
});
function le(e) {
  "autoInit" in e && (a.autoInit = e.autoInit), "projectId" in e && (a.projectId = e.projectId), "chains" in e && (a.chains = e.chains), "autoConnect" in e && (a.autoConnect = e.autoConnect), "disconnectUnknownChain" in e && (a.disconnectUnknownChain = e.disconnectUnknownChain), "reconnectToChain" in e && (a.reconnectToChain = e.reconnectToChain), "logEnabled" in e && (a.logEnabled = e.logEnabled), "enableCustomProvider" in e && (a.enableCustomProvider = e.enableCustomProvider), "web3modalOptions" in e && ("themeMode" in e.web3modalOptions && (a.web3modalOptions.themeMode = e.web3modalOptions.themeMode), "themeVariables" in e.web3modalOptions && (a.web3modalOptions.themeVariables = e.web3modalOptions.themeVariables));
}
function d(...e) {
  a.logEnabled && console.log("[WC]", ...e);
}
var o = /* @__PURE__ */ ((e) => (e.Connected = "connected", e.Disconnected = "disconnect", e.ChainSwitched = "chain_switched", e.UnknownChain = "unknown_chain", e.ModalStateChanged = "modal_state_changed", e))(o || {});
let P;
const F = f({
  client: null
});
function b(e) {
  return String(e).toLowerCase();
}
async function de([e, n], [t, i]) {
  if (a.disconnectUnknownChain && (!t && a.disconnectUnknownChain || t) && n && !a.chains.some((s) => s.id === n.id)) {
    await pe(), i && (y(o.Disconnected), d(`account ${e.address} disconnected from ${b(i.name)} chain.`)), y(o.UnknownChain, { chain: n }), d("switched to unsupported chain.");
    return;
  }
  (t == null ? void 0 : t.address) !== (e == null ? void 0 : e.address) && !(i != null && i.unsupported) && (t && (y(o.Disconnected), d(`account ${t.address} disconnected from ${b(i.name)} chain.`)), e && (y(o.Connected, { chain: u.bufferChain, account: p.bufferAccount }), d(`account ${e.address} connected to ${b(n.name)} chain.`))), i && n && i.id !== n.id && (a.reconnectToChain ? (y(o.Disconnected), d(`account ${t.address} disconnected from ${b(i.name)} chain.`), y(o.Connected, { chain: u.bufferChain, account: p.bufferAccount }), d(`account ${e.address} connected to ${b(n.name)} chain.`)) : (y(o.ChainSwitched, { chain: n }), d(`account ${e.address} switched to ${b(n.name)} chain.`)));
}
function me([e, n], [t, i]) {
  clearTimeout(P), P = setTimeout(de, 200, [e, n], [t, i]);
}
function v() {
  if (r.value)
    return;
  const e = R(a.chains), n = [];
  a.enableCustomProvider ? n.push(ce()) : n.push(te({ projectId: a.projectId }));
  const { publicClient: t, webSocketPublicClient: i } = j(e, n), s = D({
    autoConnect: a.autoConnect,
    connectors: ae({
      projectId: a.projectId,
      chains: e
    }),
    publicClient: t,
    webSocketPublicClient: i
  });
  H((l) => {
    var C;
    (C = l.chain) != null && C.unsupported && (l.chain.name = "Unsupported"), u.bufferChain = l.chain || null;
  }), V((l) => {
    p.bufferAccount = l.address ? l : null;
  }), $([() => p.bufferAccount, () => u.bufferChain], me);
  const T = new ie(s, e);
  F.client = T, he(T);
}
const p = f({
  bufferAccount: null,
  currentAccount: null
}), m = f({
  connected: !1,
  address: void 0,
  shortAddress: void 0
});
async function pe() {
  await W();
}
async function ke(e) {
  var n, t;
  r.value || v(), e instanceof Event && (e = a.chains[0]), (n = r.value) == null || n.setDefaultChain(e || a.chains[0]), await ((t = r.value) == null ? void 0 : t.openModal({
    route: "ConnectWallet"
  }));
}
async function Me() {
  var e;
  r.value || v(), await ((e = r.value) == null ? void 0 : e.openModal({
    route: "Account"
  }));
}
function ye(e = "") {
  return `${e.slice(0, 5)}...${e.slice(-4)}`;
}
S(() => {
  p.currentAccount ? (m.connected = !0, m.address = p.currentAccount.address, m.shortAddress = ye(p.currentAccount.address)) : (m.connected = !1, m.address = void 0, m.shortAddress = void 0);
});
const M = new ne();
function y(e, ...n) {
  e === o.Connected || e === o.Disconnected ? (u.currentChain = u.bufferChain, p.currentAccount = p.bufferAccount) : e === o.ChainSwitched && (u.currentChain = u.bufferChain), setTimeout(M.emit, 0, e, null, ...n);
}
function Pe(e, n) {
  M.on(e, n), a.logEnabled && d(`Subscribe for ${e} event.`);
}
function $e(e, n) {
  M.detach(e, n), a.logEnabled && d(`Unsubscribe for ${e} event.`);
}
const r = k(null);
function he(e) {
  var n;
  r.value = new ee(
    {
      projectId: a.projectId,
      ...(a == null ? void 0 : a.web3modalOptions) || []
    },
    e
  ), (n = r.value) == null || n.subscribeModal(({ open: t }) => {
    y(o.ModalStateChanged, t);
  });
}
const u = f({
  bufferChain: null,
  currentChain: null
}), c = _(() => u.currentChain ? u.currentChain : a.chains[0]);
function xe() {
  return a.chains;
}
async function Ee(e) {
  var n;
  r.value || v(), await ((n = F.client) == null ? void 0 : n.switchNetwork({ chainId: e.id }));
}
async function Fe() {
  var e;
  r.value || v(), await ((e = r.value) == null ? void 0 : e.openModal({
    route: "SelectNetwork"
  }));
}
function be(e) {
  return L({
    chainId: e.chainId || c.value.id,
    address: e.address,
    token: e.token,
    formatUnits: e.formatUnits
  });
}
function Ue(e, n) {
  const t = k(!1), i = k(!1), s = f({
    decimals: 0,
    formatted: "",
    symbol: "",
    value: 0n
  });
  let T, l, C = e.chainId || c.value.id;
  const g = {
    disableAutoFetch: (n == null ? void 0 : n.disableAutoFetch) || !1,
    autoReloadTime: (n == null ? void 0 : n.autoReloadTime) || 3e4,
    disableAutoReload: (n == null ? void 0 : n.disableAutoReload) || !1
  };
  async function w() {
    (!i.value || !t.value) && (i.value = !0, await be(e).then((h) => {
      (h.value !== s.value || !t.value) && (s.decimals = h.decimals, s.formatted = h.formatted, s.symbol = h.symbol, s.value = h.value);
    }).finally(() => {
      t.value = !0, i.value = !1, A();
    }));
  }
  function I() {
    return clearTimeout(T), w();
  }
  function U() {
    g.disableAutoReload = !0;
  }
  function A() {
    g.disableAutoReload !== !0 && (T = setTimeout(I, g.autoReloadTime || 3e4));
  }
  function N() {
    t.value = !1, s.decimals = 0, s.formatted = "", s.symbol = "", s.value = 0n;
  }
  function G() {
    clearTimeout(l), C = c.value.id, N(), I();
  }
  return g.disableAutoFetch !== !0 && w(), e.chainId === void 0 && $(() => c.value.id, (h) => {
    h !== C && (l = setTimeout(G));
  }), {
    loaded: t,
    fetching: i,
    data: s,
    fetch: w,
    reload: I,
    disableAutoReload: U
  };
}
function Ae(e) {
  return z({
    chainId: (e == null ? void 0 : e.chainId) || c.value.id
  });
}
async function Ne(e) {
  return q({
    chainId: e.chainId || c.value.id,
    address: e.address,
    abi: e.abi,
    functionName: e.functionName,
    args: e.args || [],
    account: e.account || m.address,
    blockNumber: e.blockNumber,
    blockTag: e.blockTag
  });
}
async function Ge(e) {
  const { hash: n } = await J({
    chainId: e.chainId || c.value.id,
    address: e.address,
    abi: e.abi,
    functionName: e.functionName,
    args: e.args || [],
    account: e.account || m.address,
    gas: e.gas,
    gasPrice: e.gasPrice,
    maxFeePerGas: e.maxFeePerGas,
    maxPriorityFeePerGas: e.maxPriorityFeePerGas,
    nonce: e.nonce,
    value: e.value
  });
  function t() {
    return E({
      chainId: e.chainId || c.value.id,
      hash: n,
      confirmations: e.confirmations || 1
    });
  }
  return {
    hash: n,
    wait: t
  };
}
async function Re(e) {
  return await x({ chainId: e.chainId || c.value.id }).estimateContractGas({
    address: e.address,
    abi: e.abi,
    functionName: e.functionName,
    args: e.args || [],
    // @ts-ignore
    account: e.account || m.address,
    gasPrice: e.gasPrice,
    maxFeePerGas: e.maxFeePerGas,
    maxPriorityFeePerGas: e.maxPriorityFeePerGas,
    nonce: e.nonce,
    value: e.value
  });
}
function Se(e, n) {
  const t = [];
  return n.logs.forEach((i) => {
    try {
      t.push(se({
        abi: e.abi,
        topics: i.topics,
        data: i.data
      }));
    } catch {
    }
  }), t;
}
function _e(e, n) {
  return K({
    chainId: (e == null ? void 0 : e.chainId) || c.value.id,
    address: e.address,
    abi: e.abi,
    eventName: e.eventName
  }, n);
}
function je(e) {
  return Q({
    chainId: (e == null ? void 0 : e.chainId) || c.value.id,
    formatUnits: e == null ? void 0 : e.formatUnits
  });
}
function De(e) {
  return X({
    message: e
  });
}
async function He(e) {
  const n = [];
  return e.calls.forEach((t) => {
    t.calls.forEach(([i, s]) => {
      n.push({
        address: t.contractAddress,
        abi: t.abi,
        functionName: i,
        args: s
      });
    });
  }), await Y({
    chainId: e.chainId,
    contracts: n,
    multicallAddress: e.multicallAddress,
    blockTag: e.blockTag,
    blockNumber: e.blockNumber,
    batchSize: e.batchSize,
    allowFailure: e.allowFailure
  });
}
function Ve(e) {
  return Z({
    chainId: e.chainId || c.value.id,
    address: e.address,
    formatUnits: e.formatUnits
  });
}
function We(e) {
  return O({
    chainId: e.chainId || c.value.id,
    hash: e.hash
  });
}
function Le(e) {
  return x({ chainId: e.chainId || c.value.id }).getTransactionReceipt({
    hash: e.hash
  });
}
async function ze(e) {
  const { hash: n } = await B({
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
  return E({
    chainId: e.chainId || c.value.id,
    hash: n,
    confirmations: e.confirmations || 1
  });
}
const qe = [
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
], Je = [
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
function Ke(e) {
  return {
    install() {
      le(e), a.autoInit && v();
    }
  };
}
export {
  $e as $off,
  Pe as $on,
  fe as Chains,
  o as Events,
  m as account,
  Me as accountDetails,
  c as chain,
  ke as connect,
  Ke as createWeb3Auth,
  pe as disconnect,
  qe as erc20ABI,
  Re as estimateWriteContractGas,
  be as fetchBalance,
  Ae as fetchBlockNumber,
  je as fetchGasPrice,
  Ve as fetchToken,
  We as fetchTransaction,
  Le as fetchTransactionReceipt,
  xe as getAvailableChains,
  v as init,
  He as multicall,
  Je as multicallABI,
  Se as parseEvents,
  Ne as readContract,
  Fe as selectChain,
  ze as sendTransaction,
  ye as shortAddressFilter,
  De as signMessage,
  Ee as switchChain,
  Ue as useFetchBalance,
  _e as watchContractEvent,
  Ge as writeContract
};
