import * as P from "@wagmi/core/chains";
import { reactive as m, computed as w, ref as k, watch as C, toRaw as h } from "vue";
import { disconnect as M, configureChains as v, createConfig as $, watchNetwork as I, watchAccount as E, readContract as S, multicall as x } from "@wagmi/core";
import { w3mProvider as U, w3mConnectors as D, EthereumClient as N } from "@web3modal/ethereum";
import { Web3Modal as _ } from "@web3modal/html";
import j from "js-event-bus";
var A = {
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
const F = A, n = m({
  autoInit: !0,
  projectId: "",
  chains: [F],
  autoConnect: !0,
  disconnectUnknownChain: !0,
  reconnectToChain: !0,
  logEnabled: !1,
  web3modalOptions: {
    themeMode: "light",
    themeVariables: {}
  }
});
function H(e) {
  "autoInit" in e && (n.autoInit = e.autoInit), "projectId" in e && (n.projectId = e.projectId), "chains" in e && (n.chains = e.chains), "autoConnect" in e && (n.autoConnect = e.autoConnect), "disconnectUnknownChain" in e && (n.disconnectUnknownChain = e.disconnectUnknownChain), "reconnectToChain" in e && (n.reconnectToChain = e.reconnectToChain), "logEnabled" in e && (n.logEnabled = e.logEnabled), "web3modalOptions" in e && ("themeMode" in e.web3modalOptions && (n.web3modalOptions.themeMode = e.web3modalOptions.themeMode), "themeVariables" in e.web3modalOptions && (n.web3modalOptions.themeVariables = e.web3modalOptions.themeVariables));
}
const c = m({
  bufferChain: null,
  currentChain: null
}), V = w(() => c.currentChain ? c.currentChain : n.chains[0]);
function Y() {
  return n.chains;
}
async function Z(e) {
  var t;
  o.value || b(), await ((t = g.client) == null ? void 0 : t.switchNetwork({ chainId: e.id }));
}
async function O() {
  var e;
  o.value || b(), await ((e = o.value) == null ? void 0 : e.openModal({
    route: "SelectNetwork"
  }));
}
function l(...e) {
  n.logEnabled && console.log("[WC]", ...e);
}
var s = /* @__PURE__ */ ((e) => (e.Connected = "connected", e.Disconnected = "disconnect", e.ChainSwitched = "chain_switched", e.UnknownChain = "unknown_chain", e.ModalStateChanged = "modal_state_changed", e))(s || {});
const f = new j();
function r(e, ...t) {
  e === s.Connected || e === s.Disconnected ? (c.currentChain = c.bufferChain, d.currentAccount = d.bufferAccount) : e === s.ChainSwitched && (c.currentChain = c.bufferChain), f.emit(e, null, ...t);
}
function B(e, t) {
  f.on(e, t), n.logEnabled && l(`Subscribe for ${e} event.`);
}
function ee(e, t) {
  f.detach(e, t), n.logEnabled && l(`Unsubscribe for ${e} event.`);
}
const o = k(null);
function W(e) {
  var t;
  o.value = new _(
    {
      projectId: n.projectId,
      ...(n == null ? void 0 : n.web3modalOptions) || []
    },
    e
  ), (t = o.value) == null || t.subscribeModal(({ open: a }) => {
    r(s.ModalStateChanged, a);
  });
}
const d = m({
  bufferAccount: null,
  currentAccount: null
}), u = m({
  connected: !1,
  address: void 0,
  shortAddress: void 0
});
async function L() {
  await M();
}
async function te(e) {
  var t, a;
  o.value || b(), e instanceof Event && (e = n.chains[0]), (t = o.value) == null || t.setDefaultChain(e || n.chains[0]), await ((a = o.value) == null ? void 0 : a.openModal({
    route: "ConnectWallet"
  }));
}
async function ne() {
  var e;
  o.value || b(), await ((e = o.value) == null ? void 0 : e.openModal({
    route: "Account"
  }));
}
function R(e = "") {
  return `${e.slice(0, 5)}...${e.slice(-4)}`;
}
C(() => d.currentAccount, (e) => {
  e ? (u.connected = !0, u.address = e.address, u.shortAddress = R(e.address)) : (u.connected = !1, u.address = void 0, u.shortAddress = void 0);
});
let T;
const g = m({
  client: null
});
function y(e) {
  return String(e).toLowerCase();
}
async function z([e, t], [a, i]) {
  if (n.disconnectUnknownChain && (!a && n.disconnectUnknownChain || a) && t && !n.chains.some((p) => p.id === t.id)) {
    await L(), i && (r(s.Disconnected), l(`account ${e.address} disconnected from ${y(i.name)} chain.`)), r(s.UnknownChain, { chain: t }), l("switched to unsupported chain.");
    return;
  }
  (a == null ? void 0 : a.address) !== (e == null ? void 0 : e.address) && !(i != null && i.unsupported) && (a && (r(s.Disconnected), l(`account ${a.address} disconnected from ${y(i.name)} chain.`)), e && (r(s.Connected, { chain: c.bufferChain, account: d.bufferAccount }), l(`account ${e.address} connected to ${y(t.name)} chain.`))), i && t && i.id !== t.id && (n.reconnectToChain ? (r(s.Disconnected), l(`account ${a.address} disconnected from ${y(i.name)} chain.`), r(s.Connected, { chain: c.bufferChain, account: d.bufferAccount }), l(`account ${e.address} connected to ${y(t.name)} chain.`)) : (r(s.ChainSwitched, { chain: t }), l(`account ${e.address} switched to ${y(t.name)} chain.`)));
}
function G([e, t], [a, i]) {
  clearTimeout(T), T = setTimeout(z, 200, [e, t], [a, i]);
}
function b() {
  if (o.value)
    return;
  const { publicClient: e } = v(h(n.chains), [U({ projectId: n.projectId })]), t = $({
    autoConnect: n.autoConnect,
    connectors: D({
      projectId: n.projectId,
      version: 2,
      chains: h(n.chains)
    }),
    publicClient: e
  });
  I((i) => {
    var p;
    (p = i.chain) != null && p.unsupported && (i.chain.name = "Unsupported"), c.bufferChain = i.chain || null;
  }), E((i) => {
    d.bufferAccount = i.address ? i : null;
  }), C([() => d.bufferAccount, () => c.bufferChain], G);
  const a = new N(t, h(n.chains));
  g.client = a, W(a);
}
function ae(e) {
  return {
    install() {
      H(e), b();
    }
  };
}
async function ie(e) {
  return S({
    chainId: e.chainId || V.value.id,
    address: e.address,
    abi: e.abi,
    functionName: e.functionName,
    args: e.args || [],
    account: e.account || u.address,
    blockNumber: e.blockNumber,
    blockTag: e.blockTag
  });
}
async function se(e) {
  const t = [];
  return e.calls.forEach((a) => {
    a.calls.forEach(([i, p]) => {
      t.push({
        address: a.contractAddress,
        abi: a.abi,
        functionName: i,
        args: p
      });
    });
  }), await x({
    chainId: e.chainId,
    contracts: t,
    multicallAddress: e.multicallAddress,
    blockTag: e.blockTag,
    blockNumber: e.blockNumber,
    batchSize: e.batchSize,
    allowFailure: e.allowFailure
  });
}
const oe = [
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
], ce = [
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
  ee as $off,
  B as $on,
  P as Chains,
  s as Events,
  u as account,
  ne as accountDetails,
  V as chain,
  te as connect,
  ae as createWeb3Auth,
  L as disconnect,
  oe as erc20ABI,
  Y as getAvailableChains,
  se as multicall,
  ce as multicallABI,
  ie as readContract,
  O as selectChain,
  R as shortAddressFilter,
  Z as switchChain
};
