import * as be from "@wagmi/core/chains";
import { reactive as f, toRaw as G, watch as $, watchEffect as S, ref as I, computed as R } from "vue";
import { configureChains as _, createConfig as j, watchNetwork as D, watchAccount as H, disconnect as V, fetchBalance as W, fetchBlockNumber as z, readContract as L, writeContract as q, getPublicClient as J, waitForTransaction as x, watchContractEvent as K, fetchFeeData as Q, signMessage as X, multicall as Y, fetchToken as Z, fetchTransaction as O, sendTransaction as B } from "@wagmi/core";
import { Web3Modal as ee } from "@web3modal/html";
import ne from "js-event-bus";
import { w3mProvider as te, w3mConnectors as ae, EthereumClient as ie } from "@web3modal/ethereum";
function se() {
  return function(e) {
    return e.rpcUrls.public.http[0] ? {
      chain: e,
      rpcUrls: e.rpcUrls.public
    } : null;
  };
}
var ce = {
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
function oe(e, n) {
  return {
    ...e,
    formatters: n == null ? void 0 : n.formatters,
    serializers: n == null ? void 0 : n.serializers
  };
}
const re = /* @__PURE__ */ oe(ce), t = f({
  autoInit: !0,
  projectId: "",
  chains: [re],
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
  "autoInit" in e && (t.autoInit = e.autoInit), "projectId" in e && (t.projectId = e.projectId), "chains" in e && (t.chains = e.chains), "autoConnect" in e && (t.autoConnect = e.autoConnect), "disconnectUnknownChain" in e && (t.disconnectUnknownChain = e.disconnectUnknownChain), "reconnectToChain" in e && (t.reconnectToChain = e.reconnectToChain), "logEnabled" in e && (t.logEnabled = e.logEnabled), "enableCustomProvider" in e && (t.enableCustomProvider = e.enableCustomProvider), "web3modalOptions" in e && ("themeMode" in e.web3modalOptions && (t.web3modalOptions.themeMode = e.web3modalOptions.themeMode), "themeVariables" in e.web3modalOptions && (t.web3modalOptions.themeVariables = e.web3modalOptions.themeVariables));
}
function d(...e) {
  t.logEnabled && console.log("[WC]", ...e);
}
var o = /* @__PURE__ */ ((e) => (e.Connected = "connected", e.Disconnected = "disconnect", e.ChainSwitched = "chain_switched", e.UnknownChain = "unknown_chain", e.ModalStateChanged = "modal_state_changed", e))(o || {});
let P;
const F = f({
  client: null
});
function b(e) {
  return String(e).toLowerCase();
}
async function ue([e, n], [a, i]) {
  if (t.disconnectUnknownChain && (!a && t.disconnectUnknownChain || a) && n && !t.chains.some((s) => s.id === n.id)) {
    await me(), i && (y(o.Disconnected), d(`account ${e.address} disconnected from ${b(i.name)} chain.`)), y(o.UnknownChain, { chain: n }), d("switched to unsupported chain.");
    return;
  }
  (a == null ? void 0 : a.address) !== (e == null ? void 0 : e.address) && !(i != null && i.unsupported) && (a && (y(o.Disconnected), d(`account ${a.address} disconnected from ${b(i.name)} chain.`)), e && (y(o.Connected, { chain: l.bufferChain, account: p.bufferAccount }), d(`account ${e.address} connected to ${b(n.name)} chain.`))), i && n && i.id !== n.id && (t.reconnectToChain ? (y(o.Disconnected), d(`account ${a.address} disconnected from ${b(i.name)} chain.`), y(o.Connected, { chain: l.bufferChain, account: p.bufferAccount }), d(`account ${e.address} connected to ${b(n.name)} chain.`)) : (y(o.ChainSwitched, { chain: n }), d(`account ${e.address} switched to ${b(n.name)} chain.`)));
}
function de([e, n], [a, i]) {
  clearTimeout(P), P = setTimeout(ue, 200, [e, n], [a, i]);
}
function v() {
  if (r.value)
    return;
  const e = G(t.chains), n = [];
  t.enableCustomProvider ? n.push(se()) : n.push(te({ projectId: t.projectId }));
  const { publicClient: a, webSocketPublicClient: i } = _(e, n), s = j({
    autoConnect: t.autoConnect,
    connectors: ae({
      projectId: t.projectId,
      version: 2,
      chains: e
    }),
    publicClient: a,
    webSocketPublicClient: i
  });
  D((u) => {
    var C;
    (C = u.chain) != null && C.unsupported && (u.chain.name = "Unsupported"), l.bufferChain = u.chain || null;
  }), H((u) => {
    p.bufferAccount = u.address ? u : null;
  }), $([() => p.bufferAccount, () => l.bufferChain], de);
  const T = new ie(s, e);
  F.client = T, ye(T);
}
const p = f({
  bufferAccount: null,
  currentAccount: null
}), m = f({
  connected: !1,
  address: void 0,
  shortAddress: void 0
});
async function me() {
  await V();
}
async function we(e) {
  var n, a;
  r.value || v(), e instanceof Event && (e = t.chains[0]), (n = r.value) == null || n.setDefaultChain(e || t.chains[0]), await ((a = r.value) == null ? void 0 : a.openModal({
    route: "ConnectWallet"
  }));
}
async function ke() {
  var e;
  r.value || v(), await ((e = r.value) == null ? void 0 : e.openModal({
    route: "Account"
  }));
}
function pe(e = "") {
  return `${e.slice(0, 5)}...${e.slice(-4)}`;
}
S(() => {
  p.currentAccount ? (m.connected = !0, m.address = p.currentAccount.address, m.shortAddress = pe(p.currentAccount.address)) : (m.connected = !1, m.address = void 0, m.shortAddress = void 0);
});
const M = new ne();
function y(e, ...n) {
  e === o.Connected || e === o.Disconnected ? (l.currentChain = l.bufferChain, p.currentAccount = p.bufferAccount) : e === o.ChainSwitched && (l.currentChain = l.bufferChain), setTimeout(M.emit, 0, e, null, ...n);
}
function Ie(e, n) {
  M.on(e, n), t.logEnabled && d(`Subscribe for ${e} event.`);
}
function Me(e, n) {
  M.detach(e, n), t.logEnabled && d(`Unsubscribe for ${e} event.`);
}
const r = I(null);
function ye(e) {
  var n;
  r.value = new ee(
    {
      projectId: t.projectId,
      ...(t == null ? void 0 : t.web3modalOptions) || []
    },
    e
  ), (n = r.value) == null || n.subscribeModal(({ open: a }) => {
    y(o.ModalStateChanged, a);
  });
}
const l = f({
  bufferChain: null,
  currentChain: null
}), c = R(() => l.currentChain ? l.currentChain : t.chains[0]);
function Pe() {
  return t.chains;
}
async function $e(e) {
  var n;
  r.value || v(), await ((n = F.client) == null ? void 0 : n.switchNetwork({ chainId: e.id }));
}
async function xe() {
  var e;
  r.value || v(), await ((e = r.value) == null ? void 0 : e.openModal({
    route: "SelectNetwork"
  }));
}
function he(e) {
  return W({
    chainId: e.chainId || c.value.id,
    address: e.address,
    token: e.token,
    formatUnits: e.formatUnits
  });
}
function Fe(e, n) {
  const a = I(!1), i = I(!1), s = f({
    decimals: 0,
    formatted: "",
    symbol: "",
    value: 0n
  });
  let T, u, C = e.chainId || c.value.id;
  const g = {
    disableAutoFetch: (n == null ? void 0 : n.disableAutoFetch) || !1,
    autoReloadTime: (n == null ? void 0 : n.autoReloadTime) || 3e4,
    disableAutoReload: (n == null ? void 0 : n.disableAutoReload) || !1
  };
  async function w() {
    (!i.value || !a.value) && (i.value = !0, await he(e).then((h) => {
      (h.value !== s.value || !a.value) && (s.decimals = h.decimals, s.formatted = h.formatted, s.symbol = h.symbol, s.value = h.value);
    }).finally(() => {
      a.value = !0, i.value = !1, U();
    }));
  }
  function k() {
    return clearTimeout(T), w();
  }
  function E() {
    g.disableAutoReload = !0;
  }
  function U() {
    g.disableAutoReload !== !0 && (T = setTimeout(k, g.autoReloadTime || 3e4));
  }
  function A() {
    a.value = !1, s.decimals = 0, s.formatted = "", s.symbol = "", s.value = 0n;
  }
  function N() {
    clearTimeout(u), C = c.value.id, A(), k();
  }
  return g.disableAutoFetch !== !0 && w(), e.chainId === void 0 && $(() => c.value.id, (h) => {
    h !== C && (u = setTimeout(N));
  }), {
    loaded: a,
    fetching: i,
    data: s,
    fetch: w,
    reload: k,
    disableAutoReload: E
  };
}
function Ee(e) {
  return z({
    chainId: (e == null ? void 0 : e.chainId) || c.value.id
  });
}
async function Ue(e) {
  return L({
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
async function Ae(e) {
  const { hash: n } = await q({
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
  function a() {
    return x({
      chainId: e.chainId || c.value.id,
      hash: n,
      confirmations: e.confirmations || 1
    });
  }
  return {
    hash: n,
    wait: a
  };
}
async function Ne(e) {
  return await J({ chainId: e.chainId || c.value.id }).estimateContractGas({
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
function Ge(e, n) {
  return K({
    chainId: (e == null ? void 0 : e.chainId) || c.value.id,
    address: e.address,
    abi: e.abi,
    eventName: e.eventName
  }, n);
}
function Se(e) {
  return Q({
    chainId: (e == null ? void 0 : e.chainId) || c.value.id,
    formatUnits: e == null ? void 0 : e.formatUnits
  });
}
function Re(e) {
  return X({
    message: e
  });
}
async function _e(e) {
  const n = [];
  return e.calls.forEach((a) => {
    a.calls.forEach(([i, s]) => {
      n.push({
        address: a.contractAddress,
        abi: a.abi,
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
function je(e) {
  return Z({
    chainId: e.chainId || c.value.id,
    address: e.address,
    formatUnits: e.formatUnits
  });
}
function De(e) {
  return O({
    chainId: e.chainId || c.value.id,
    hash: e.hash
  });
}
async function He(e) {
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
  return x({
    chainId: e.chainId || c.value.id,
    hash: n,
    confirmations: e.confirmations || 1
  });
}
const Ve = [
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
], We = [
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
function ze(e) {
  return {
    install() {
      le(e), v();
    }
  };
}
export {
  Me as $off,
  Ie as $on,
  be as Chains,
  o as Events,
  m as account,
  ke as accountDetails,
  c as chain,
  we as connect,
  ze as createWeb3Auth,
  me as disconnect,
  Ve as erc20ABI,
  Ne as estimateWriteContractGas,
  he as fetchBalance,
  Ee as fetchBlockNumber,
  Se as fetchGasPrice,
  je as fetchToken,
  De as fetchTransaction,
  Pe as getAvailableChains,
  v as init,
  _e as multicall,
  We as multicallABI,
  Ue as readContract,
  xe as selectChain,
  He as sendTransaction,
  pe as shortAddressFilter,
  Re as signMessage,
  $e as switchChain,
  Fe as useFetchBalance,
  Ge as watchContractEvent,
  Ae as writeContract
};
