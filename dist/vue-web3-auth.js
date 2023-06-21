import * as ye from "@wagmi/core/chains";
import { reactive as b, toRaw as w, watch as I, ref as g, computed as S } from "vue";
import { configureChains as R, createConfig as _, watchNetwork as j, watchAccount as D, disconnect as H, fetchBalance as V, fetchBlockNumber as W, readContract as L, writeContract as z, waitForTransaction as F, getPublicClient as q, watchContractEvent as J, fetchFeeData as K, signMessage as Q, multicall as X, fetchToken as Y, fetchTransaction as Z, sendTransaction as O } from "@wagmi/core";
import { Web3Modal as B } from "@web3modal/html";
import ee from "js-event-bus";
import { w3mProvider as ne, w3mConnectors as te, EthereumClient as ae } from "@web3modal/ethereum";
var ie = {
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
const se = ie, t = b({
  autoInit: !0,
  projectId: "",
  chains: [se],
  autoConnect: !0,
  disconnectUnknownChain: !0,
  reconnectToChain: !0,
  logEnabled: !1,
  web3modalOptions: {
    themeMode: "light",
    themeVariables: {}
  }
});
function ce(e) {
  "autoInit" in e && (t.autoInit = e.autoInit), "projectId" in e && (t.projectId = e.projectId), "chains" in e && (t.chains = e.chains), "autoConnect" in e && (t.autoConnect = e.autoConnect), "disconnectUnknownChain" in e && (t.disconnectUnknownChain = e.disconnectUnknownChain), "reconnectToChain" in e && (t.reconnectToChain = e.reconnectToChain), "logEnabled" in e && (t.logEnabled = e.logEnabled), "web3modalOptions" in e && ("themeMode" in e.web3modalOptions && (t.web3modalOptions.themeMode = e.web3modalOptions.themeMode), "themeVariables" in e.web3modalOptions && (t.web3modalOptions.themeVariables = e.web3modalOptions.themeVariables));
}
function u(...e) {
  t.logEnabled && console.log("[WC]", ...e);
}
var o = /* @__PURE__ */ ((e) => (e.Connected = "connected", e.Disconnected = "disconnect", e.ChainSwitched = "chain_switched", e.UnknownChain = "unknown_chain", e.ModalStateChanged = "modal_state_changed", e))(o || {});
let x;
const E = b({
  client: null
});
function h(e) {
  return String(e).toLowerCase();
}
async function oe([e, n], [a, i]) {
  if (t.disconnectUnknownChain && (!a && t.disconnectUnknownChain || a) && n && !t.chains.some((c) => c.id === n.id)) {
    await le(), i && (m(o.Disconnected), u(`account ${e.address} disconnected from ${h(i.name)} chain.`)), m(o.UnknownChain, { chain: n }), u("switched to unsupported chain.");
    return;
  }
  (a == null ? void 0 : a.address) !== (e == null ? void 0 : e.address) && !(i != null && i.unsupported) && (a && (m(o.Disconnected), u(`account ${a.address} disconnected from ${h(i.name)} chain.`)), e && (m(o.Connected, { chain: l.bufferChain, account: p.bufferAccount }), u(`account ${e.address} connected to ${h(n.name)} chain.`))), i && n && i.id !== n.id && (t.reconnectToChain ? (m(o.Disconnected), u(`account ${a.address} disconnected from ${h(i.name)} chain.`), m(o.Connected, { chain: l.bufferChain, account: p.bufferAccount }), u(`account ${e.address} connected to ${h(n.name)} chain.`)) : (m(o.ChainSwitched, { chain: n }), u(`account ${e.address} switched to ${h(n.name)} chain.`)));
}
function re([e, n], [a, i]) {
  clearTimeout(x), x = setTimeout(oe, 200, [e, n], [a, i]);
}
function f() {
  if (r.value)
    return;
  const { publicClient: e } = R(w(t.chains), [ne({ projectId: t.projectId })]), n = _({
    autoConnect: t.autoConnect,
    connectors: te({
      projectId: t.projectId,
      version: 2,
      chains: w(t.chains)
    }),
    publicClient: e
  });
  j((i) => {
    var c;
    (c = i.chain) != null && c.unsupported && (i.chain.name = "Unsupported"), l.bufferChain = i.chain || null;
  }), D((i) => {
    p.bufferAccount = i.address ? i : null;
  }), I([() => p.bufferAccount, () => l.bufferChain], re);
  const a = new ae(n, w(t.chains));
  E.client = a, de(a);
}
const p = b({
  bufferAccount: null,
  currentAccount: null
}), d = b({
  connected: !1,
  address: void 0,
  shortAddress: void 0
});
async function le() {
  await H();
}
async function ge(e) {
  var n, a;
  r.value || f(), e instanceof Event && (e = t.chains[0]), (n = r.value) == null || n.setDefaultChain(e || t.chains[0]), await ((a = r.value) == null ? void 0 : a.openModal({
    route: "ConnectWallet"
  }));
}
async function ve() {
  var e;
  r.value || f(), await ((e = r.value) == null ? void 0 : e.openModal({
    route: "Account"
  }));
}
function ue(e = "") {
  return `${e.slice(0, 5)}...${e.slice(-4)}`;
}
I(() => p.currentAccount, (e) => {
  e ? (d.connected = !0, d.address = e.address, d.shortAddress = ue(e.address)) : (d.connected = !1, d.address = void 0, d.shortAddress = void 0);
});
const k = new ee();
function m(e, ...n) {
  e === o.Connected || e === o.Disconnected ? (l.currentChain = l.bufferChain, p.currentAccount = p.bufferAccount) : e === o.ChainSwitched && (l.currentChain = l.bufferChain), k.emit(e, null, ...n);
}
function Ce(e, n) {
  k.on(e, n), t.logEnabled && u(`Subscribe for ${e} event.`);
}
function we(e, n) {
  k.detach(e, n), t.logEnabled && u(`Unsubscribe for ${e} event.`);
}
const r = g(null);
function de(e) {
  var n;
  r.value = new B(
    {
      projectId: t.projectId,
      ...(t == null ? void 0 : t.web3modalOptions) || []
    },
    e
  ), (n = r.value) == null || n.subscribeModal(({ open: a }) => {
    m(o.ModalStateChanged, a);
  });
}
const l = b({
  bufferChain: null,
  currentChain: null
}), s = S(() => l.currentChain ? l.currentChain : t.chains[0]);
function Ie() {
  return t.chains;
}
async function ke(e) {
  var n;
  r.value || f(), await ((n = E.client) == null ? void 0 : n.switchNetwork({ chainId: e.id }));
}
async function Me() {
  var e;
  r.value || f(), await ((e = r.value) == null ? void 0 : e.openModal({
    route: "SelectNetwork"
  }));
}
function me(e) {
  return V({
    chainId: e.chainId || s.value.id,
    address: e.address,
    token: e.token,
    formatUnits: e.formatUnits
  });
}
function $e(e, n) {
  const a = g(!1), i = g(!1), c = g({
    decimals: 0,
    formatted: "",
    symbol: "",
    value: 0n
  });
  let M, $, P = e.chainId || s.value.id;
  const T = {
    disableAutoFetch: (n == null ? void 0 : n.disableAutoFetch) || !1,
    autoReloadTime: (n == null ? void 0 : n.autoReloadTime) || 3e4,
    disableAutoReload: (n == null ? void 0 : n.disableAutoReload) || !1
  };
  async function v() {
    (!i.value || !a.value) && (i.value = !0, await me(e).then((y) => {
      (y.value !== c.value.value || !a.value) && (c.value.decimals = y.decimals, c.value.formatted = y.formatted, c.value.symbol = y.symbol, c.value.value = y.value);
    }).finally(() => {
      a.value = !0, i.value = !1, U();
    }));
  }
  function C() {
    return clearTimeout(M), v();
  }
  function N() {
    T.disableAutoReload = !0;
  }
  function U() {
    T.disableAutoReload !== !0 && (M = setTimeout(C, T.autoReloadTime || 3e4));
  }
  function A() {
    a.value = !1, c.value = {
      decimals: 0,
      formatted: "",
      symbol: "",
      value: 0n
    };
  }
  function G() {
    clearTimeout($), P = s.value.id, A(), C();
  }
  return T.disableAutoFetch !== !0 && v(), e.chainId === void 0 && I(() => s.value.id, (y) => {
    y !== P && ($ = setTimeout(G));
  }), {
    loaded: a,
    fetching: i,
    data: c,
    fetch: v,
    reload: C,
    disableAutoReload: N
  };
}
function Pe(e) {
  return W({
    chainId: (e == null ? void 0 : e.chainId) || s.value.id
  });
}
async function xe(e) {
  return L({
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
async function Fe(e) {
  const { hash: n } = await z({
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
async function Ee(e) {
  return await q({ chainId: e.chainId || s.value.id }).estimateContractGas({
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
  return J({
    chainId: (e == null ? void 0 : e.chainId) || s.value.id,
    address: e.address,
    abi: e.abi,
    eventName: e.eventName
  }, n);
}
function Ue(e) {
  return K({
    chainId: (e == null ? void 0 : e.chainId) || s.value.id,
    formatUnits: e == null ? void 0 : e.formatUnits
  });
}
function Ae(e) {
  return Q({
    message: e
  });
}
async function Ge(e) {
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
  }), await X({
    chainId: e.chainId,
    contracts: n,
    multicallAddress: e.multicallAddress,
    blockTag: e.blockTag,
    blockNumber: e.blockNumber,
    batchSize: e.batchSize,
    allowFailure: e.allowFailure
  });
}
function Se(e) {
  return Y({
    chainId: e.chainId || s.value.id,
    address: e.address,
    formatUnits: e.formatUnits
  });
}
function Re(e) {
  return Z({
    chainId: e.chainId || s.value.id,
    hash: e.hash
  });
}
async function _e(e) {
  const { hash: n } = await O({
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
const je = [
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
], De = [
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
function He(e) {
  return {
    install() {
      ce(e), f();
    }
  };
}
export {
  we as $off,
  Ce as $on,
  ye as Chains,
  o as Events,
  d as account,
  ve as accountDetails,
  s as chain,
  ge as connect,
  He as createWeb3Auth,
  le as disconnect,
  je as erc20ABI,
  Ee as estimateWriteContractGas,
  me as fetchBalance,
  Pe as fetchBlockNumber,
  Ue as fetchGasPrice,
  Se as fetchToken,
  Re as fetchTransaction,
  Ie as getAvailableChains,
  f as init,
  Ge as multicall,
  De as multicallABI,
  xe as readContract,
  Me as selectChain,
  _e as sendTransaction,
  ue as shortAddressFilter,
  Ae as signMessage,
  ke as switchChain,
  $e as useFetchBalance,
  Ne as watchContractEvent,
  Fe as writeContract
};
