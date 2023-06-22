import * as pe from "@wagmi/core/chains";
import { reactive as b, toRaw as w, watch as x, watchEffect as S, ref as g, computed as R } from "vue";
import { configureChains as _, createConfig as j, watchNetwork as D, watchAccount as H, disconnect as V, fetchBalance as W, fetchBlockNumber as L, readContract as z, writeContract as q, waitForTransaction as F, getPublicClient as J, watchContractEvent as K, fetchFeeData as Q, signMessage as X, multicall as Y, fetchToken as Z, fetchTransaction as O, sendTransaction as B } from "@wagmi/core";
import { Web3Modal as ee } from "@web3modal/html";
import ne from "js-event-bus";
import { w3mProvider as te, w3mConnectors as ae, EthereumClient as ie } from "@web3modal/ethereum";
var se = {
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
const ce = se, t = b({
  autoInit: !0,
  projectId: "",
  chains: [ce],
  autoConnect: !0,
  disconnectUnknownChain: !0,
  reconnectToChain: !0,
  logEnabled: !1,
  web3modalOptions: {
    themeMode: "light",
    themeVariables: {}
  }
});
function oe(e) {
  "autoInit" in e && (t.autoInit = e.autoInit), "projectId" in e && (t.projectId = e.projectId), "chains" in e && (t.chains = e.chains), "autoConnect" in e && (t.autoConnect = e.autoConnect), "disconnectUnknownChain" in e && (t.disconnectUnknownChain = e.disconnectUnknownChain), "reconnectToChain" in e && (t.reconnectToChain = e.reconnectToChain), "logEnabled" in e && (t.logEnabled = e.logEnabled), "web3modalOptions" in e && ("themeMode" in e.web3modalOptions && (t.web3modalOptions.themeMode = e.web3modalOptions.themeMode), "themeVariables" in e.web3modalOptions && (t.web3modalOptions.themeVariables = e.web3modalOptions.themeVariables));
}
function u(...e) {
  t.logEnabled && console.log("[WC]", ...e);
}
var o = /* @__PURE__ */ ((e) => (e.Connected = "connected", e.Disconnected = "disconnect", e.ChainSwitched = "chain_switched", e.UnknownChain = "unknown_chain", e.ModalStateChanged = "modal_state_changed", e))(o || {});
let P;
const E = b({
  client: null
});
function h(e) {
  return String(e).toLowerCase();
}
async function re([e, n], [a, i]) {
  if (t.disconnectUnknownChain && (!a && t.disconnectUnknownChain || a) && n && !t.chains.some((c) => c.id === n.id)) {
    await ue(), i && (y(o.Disconnected), u(`account ${e.address} disconnected from ${h(i.name)} chain.`)), y(o.UnknownChain, { chain: n }), u("switched to unsupported chain.");
    return;
  }
  (a == null ? void 0 : a.address) !== (e == null ? void 0 : e.address) && !(i != null && i.unsupported) && (a && (y(o.Disconnected), u(`account ${a.address} disconnected from ${h(i.name)} chain.`)), e && (y(o.Connected, { chain: l.bufferChain, account: m.bufferAccount }), u(`account ${e.address} connected to ${h(n.name)} chain.`))), i && n && i.id !== n.id && (t.reconnectToChain ? (y(o.Disconnected), u(`account ${a.address} disconnected from ${h(i.name)} chain.`), y(o.Connected, { chain: l.bufferChain, account: m.bufferAccount }), u(`account ${e.address} connected to ${h(n.name)} chain.`)) : (y(o.ChainSwitched, { chain: n }), u(`account ${e.address} switched to ${h(n.name)} chain.`)));
}
function le([e, n], [a, i]) {
  clearTimeout(P), P = setTimeout(re, 200, [e, n], [a, i]);
}
function f() {
  if (r.value)
    return;
  const { publicClient: e } = _(w(t.chains), [te({ projectId: t.projectId })]), n = j({
    autoConnect: t.autoConnect,
    connectors: ae({
      projectId: t.projectId,
      version: 2,
      chains: w(t.chains)
    }),
    publicClient: e
  });
  D((i) => {
    var c;
    (c = i.chain) != null && c.unsupported && (i.chain.name = "Unsupported"), l.bufferChain = i.chain || null;
  }), H((i) => {
    m.bufferAccount = i.address ? i : null;
  }), x([() => m.bufferAccount, () => l.bufferChain], le);
  const a = new ie(n, w(t.chains));
  E.client = a, me(a);
}
const m = b({
  bufferAccount: null,
  currentAccount: null
}), d = b({
  connected: !1,
  address: void 0,
  shortAddress: void 0
});
async function ue() {
  await V();
}
async function ve(e) {
  var n, a;
  r.value || f(), e instanceof Event && (e = t.chains[0]), (n = r.value) == null || n.setDefaultChain(e || t.chains[0]), await ((a = r.value) == null ? void 0 : a.openModal({
    route: "ConnectWallet"
  }));
}
async function Ce() {
  var e;
  r.value || f(), await ((e = r.value) == null ? void 0 : e.openModal({
    route: "Account"
  }));
}
function de(e = "") {
  return `${e.slice(0, 5)}...${e.slice(-4)}`;
}
S(() => {
  m.currentAccount ? (d.connected = !0, d.address = m.currentAccount.address, d.shortAddress = de(m.currentAccount.address)) : (d.connected = !1, d.address = void 0, d.shortAddress = void 0);
});
const I = new ne();
function y(e, ...n) {
  e === o.Connected || e === o.Disconnected ? (l.currentChain = l.bufferChain, m.currentAccount = m.bufferAccount) : e === o.ChainSwitched && (l.currentChain = l.bufferChain), setTimeout(I.emit, 0, e, null, ...n);
}
function we(e, n) {
  I.on(e, n), t.logEnabled && u(`Subscribe for ${e} event.`);
}
function Ie(e, n) {
  I.detach(e, n), t.logEnabled && u(`Unsubscribe for ${e} event.`);
}
const r = g(null);
function me(e) {
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
const l = b({
  bufferChain: null,
  currentChain: null
}), s = R(() => l.currentChain ? l.currentChain : t.chains[0]);
function ke() {
  return t.chains;
}
async function Me(e) {
  var n;
  r.value || f(), await ((n = E.client) == null ? void 0 : n.switchNetwork({ chainId: e.id }));
}
async function $e() {
  var e;
  r.value || f(), await ((e = r.value) == null ? void 0 : e.openModal({
    route: "SelectNetwork"
  }));
}
function ye(e) {
  return W({
    chainId: e.chainId || s.value.id,
    address: e.address,
    token: e.token,
    formatUnits: e.formatUnits
  });
}
function Pe(e, n) {
  const a = g(!1), i = g(!1), c = g({
    decimals: 0,
    formatted: "",
    symbol: "",
    value: 0n
  });
  let k, M, $ = e.chainId || s.value.id;
  const T = {
    disableAutoFetch: (n == null ? void 0 : n.disableAutoFetch) || !1,
    autoReloadTime: (n == null ? void 0 : n.autoReloadTime) || 3e4,
    disableAutoReload: (n == null ? void 0 : n.disableAutoReload) || !1
  };
  async function v() {
    (!i.value || !a.value) && (i.value = !0, await ye(e).then((p) => {
      (p.value !== c.value.value || !a.value) && (c.value.decimals = p.decimals, c.value.formatted = p.formatted, c.value.symbol = p.symbol, c.value.value = p.value);
    }).finally(() => {
      a.value = !0, i.value = !1, N();
    }));
  }
  function C() {
    return clearTimeout(k), v();
  }
  function A() {
    T.disableAutoReload = !0;
  }
  function N() {
    T.disableAutoReload !== !0 && (k = setTimeout(C, T.autoReloadTime || 3e4));
  }
  function U() {
    a.value = !1, c.value = {
      decimals: 0,
      formatted: "",
      symbol: "",
      value: 0n
    };
  }
  function G() {
    clearTimeout(M), $ = s.value.id, U(), C();
  }
  return T.disableAutoFetch !== !0 && v(), e.chainId === void 0 && x(() => s.value.id, (p) => {
    p !== $ && (M = setTimeout(G));
  }), {
    loaded: a,
    fetching: i,
    data: c,
    fetch: v,
    reload: C,
    disableAutoReload: A
  };
}
function xe(e) {
  return L({
    chainId: (e == null ? void 0 : e.chainId) || s.value.id
  });
}
async function Fe(e) {
  return z({
    chainId: e.chainId || s.value.id,
    address: e.address,
    abi: e.abi,
    functionName: e.functionName,
    args: e.args || [],
    account: e.account || d.address,
    blockNumber: e.blockNumber,
    blockTag: e.blockTag
  });
}
async function Ee(e) {
  const { hash: n } = await q({
    chainId: e.chainId || s.value.id,
    address: e.address,
    abi: e.abi,
    functionName: e.functionName,
    args: e.args || [],
    account: e.account || d.address,
    gas: e.gas,
    gasPrice: e.gasPrice,
    maxFeePerGas: e.maxFeePerGas,
    maxPriorityFeePerGas: e.maxPriorityFeePerGas,
    nonce: e.nonce,
    value: e.value
  });
  return F({
    chainId: e.chainId || s.value.id,
    hash: n,
    confirmations: e.confirmations || 1
  });
}
async function Ae(e) {
  return await J({ chainId: e.chainId || s.value.id }).estimateContractGas({
    address: e.address,
    abi: e.abi,
    functionName: e.functionName,
    args: e.args || [],
    // @ts-ignore
    account: e.account || d.address,
    gasPrice: e.gasPrice,
    maxFeePerGas: e.maxFeePerGas,
    maxPriorityFeePerGas: e.maxPriorityFeePerGas,
    nonce: e.nonce,
    value: e.value
  });
}
function Ne(e, n) {
  return K({
    chainId: (e == null ? void 0 : e.chainId) || s.value.id,
    address: e.address,
    abi: e.abi,
    eventName: e.eventName
  }, n);
}
function Ue(e) {
  return Q({
    chainId: (e == null ? void 0 : e.chainId) || s.value.id,
    formatUnits: e == null ? void 0 : e.formatUnits
  });
}
function Ge(e) {
  return X({
    message: e
  });
}
async function Se(e) {
  const n = [];
  return e.calls.forEach((a) => {
    a.calls.forEach(([i, c]) => {
      n.push({
        address: a.contractAddress,
        abi: a.abi,
        functionName: i,
        args: c
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
function Re(e) {
  return Z({
    chainId: e.chainId || s.value.id,
    address: e.address,
    formatUnits: e.formatUnits
  });
}
function _e(e) {
  return O({
    chainId: e.chainId || s.value.id,
    hash: e.hash
  });
}
async function je(e) {
  const { hash: n } = await B({
    chainId: e.chainId || s.value.id,
    to: e.to,
    account: e.account,
    gas: e.gas,
    gasPrice: e.gasPrice,
    maxFeePerGas: e.maxFeePerGas,
    maxPriorityFeePerGas: e.maxPriorityFeePerGas,
    nonce: e.nonce,
    value: e.value
  });
  return F({
    chainId: e.chainId || s.value.id,
    hash: n,
    confirmations: e.confirmations || 1
  });
}
const De = [
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
], He = [
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
function Ve(e) {
  return {
    install() {
      oe(e), f();
    }
  };
}
export {
  Ie as $off,
  we as $on,
  pe as Chains,
  o as Events,
  d as account,
  Ce as accountDetails,
  s as chain,
  ve as connect,
  Ve as createWeb3Auth,
  ue as disconnect,
  De as erc20ABI,
  Ae as estimateWriteContractGas,
  ye as fetchBalance,
  xe as fetchBlockNumber,
  Ue as fetchGasPrice,
  Re as fetchToken,
  _e as fetchTransaction,
  ke as getAvailableChains,
  f as init,
  Se as multicall,
  He as multicallABI,
  Fe as readContract,
  $e as selectChain,
  je as sendTransaction,
  de as shortAddressFilter,
  Ge as signMessage,
  Me as switchChain,
  Pe as useFetchBalance,
  Ne as watchContractEvent,
  Ee as writeContract
};
