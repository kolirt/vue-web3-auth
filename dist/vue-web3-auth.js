import * as K from "@wagmi/core/chains";
import { reactive as y, computed as k, ref as M, watch as g, toRaw as f } from "vue";
import { disconnect as v, configureChains as I, createConfig as $, watchNetwork as x, watchAccount as P, readContract as E, writeContract as F, waitForTransaction as N, getPublicClient as S, multicall as U } from "@wagmi/core";
import { w3mProvider as D, w3mConnectors as G, EthereumClient as _ } from "@web3modal/ethereum";
import { Web3Modal as j } from "@web3modal/html";
import A from "js-event-bus";
var H = {
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
const V = H, t = y({
  autoInit: !0,
  projectId: "",
  chains: [V],
  autoConnect: !0,
  disconnectUnknownChain: !0,
  reconnectToChain: !0,
  logEnabled: !1,
  web3modalOptions: {
    themeMode: "light",
    themeVariables: {}
  }
});
function W(e) {
  "autoInit" in e && (t.autoInit = e.autoInit), "projectId" in e && (t.projectId = e.projectId), "chains" in e && (t.chains = e.chains), "autoConnect" in e && (t.autoConnect = e.autoConnect), "disconnectUnknownChain" in e && (t.disconnectUnknownChain = e.disconnectUnknownChain), "reconnectToChain" in e && (t.reconnectToChain = e.reconnectToChain), "logEnabled" in e && (t.logEnabled = e.logEnabled), "web3modalOptions" in e && ("themeMode" in e.web3modalOptions && (t.web3modalOptions.themeMode = e.web3modalOptions.themeMode), "themeVariables" in e.web3modalOptions && (t.web3modalOptions.themeVariables = e.web3modalOptions.themeVariables));
}
const c = y({
  bufferChain: null,
  currentChain: null
}), h = k(() => c.currentChain ? c.currentChain : t.chains[0]);
function B() {
  return t.chains;
}
async function ee(e) {
  var n;
  o.value || b(), await ((n = w.client) == null ? void 0 : n.switchNetwork({ chainId: e.id }));
}
async function ne() {
  var e;
  o.value || b(), await ((e = o.value) == null ? void 0 : e.openModal({
    route: "SelectNetwork"
  }));
}
function r(...e) {
  t.logEnabled && console.log("[WC]", ...e);
}
var s = /* @__PURE__ */ ((e) => (e.Connected = "connected", e.Disconnected = "disconnect", e.ChainSwitched = "chain_switched", e.UnknownChain = "unknown_chain", e.ModalStateChanged = "modal_state_changed", e))(s || {});
const T = new A();
function u(e, ...n) {
  e === s.Connected || e === s.Disconnected ? (c.currentChain = c.bufferChain, d.currentAccount = d.bufferAccount) : e === s.ChainSwitched && (c.currentChain = c.bufferChain), T.emit(e, null, ...n);
}
function te(e, n) {
  T.on(e, n), t.logEnabled && r(`Subscribe for ${e} event.`);
}
function ae(e, n) {
  T.detach(e, n), t.logEnabled && r(`Unsubscribe for ${e} event.`);
}
const o = M(null);
function L(e) {
  var n;
  o.value = new j(
    {
      projectId: t.projectId,
      ...(t == null ? void 0 : t.web3modalOptions) || []
    },
    e
  ), (n = o.value) == null || n.subscribeModal(({ open: a }) => {
    u(s.ModalStateChanged, a);
  });
}
const d = y({
  bufferAccount: null,
  currentAccount: null
}), l = y({
  connected: !1,
  address: void 0,
  shortAddress: void 0
});
async function R() {
  await v();
}
async function ie(e) {
  var n, a;
  o.value || b(), e instanceof Event && (e = t.chains[0]), (n = o.value) == null || n.setDefaultChain(e || t.chains[0]), await ((a = o.value) == null ? void 0 : a.openModal({
    route: "ConnectWallet"
  }));
}
async function se() {
  var e;
  o.value || b(), await ((e = o.value) == null ? void 0 : e.openModal({
    route: "Account"
  }));
}
function z(e = "") {
  return `${e.slice(0, 5)}...${e.slice(-4)}`;
}
g(() => d.currentAccount, (e) => {
  e ? (l.connected = !0, l.address = e.address, l.shortAddress = z(e.address)) : (l.connected = !1, l.address = void 0, l.shortAddress = void 0);
});
let C;
const w = y({
  client: null
});
function m(e) {
  return String(e).toLowerCase();
}
async function q([e, n], [a, i]) {
  if (t.disconnectUnknownChain && (!a && t.disconnectUnknownChain || a) && n && !t.chains.some((p) => p.id === n.id)) {
    await R(), i && (u(s.Disconnected), r(`account ${e.address} disconnected from ${m(i.name)} chain.`)), u(s.UnknownChain, { chain: n }), r("switched to unsupported chain.");
    return;
  }
  (a == null ? void 0 : a.address) !== (e == null ? void 0 : e.address) && !(i != null && i.unsupported) && (a && (u(s.Disconnected), r(`account ${a.address} disconnected from ${m(i.name)} chain.`)), e && (u(s.Connected, { chain: c.bufferChain, account: d.bufferAccount }), r(`account ${e.address} connected to ${m(n.name)} chain.`))), i && n && i.id !== n.id && (t.reconnectToChain ? (u(s.Disconnected), r(`account ${a.address} disconnected from ${m(i.name)} chain.`), u(s.Connected, { chain: c.bufferChain, account: d.bufferAccount }), r(`account ${e.address} connected to ${m(n.name)} chain.`)) : (u(s.ChainSwitched, { chain: n }), r(`account ${e.address} switched to ${m(n.name)} chain.`)));
}
function J([e, n], [a, i]) {
  clearTimeout(C), C = setTimeout(q, 200, [e, n], [a, i]);
}
function b() {
  if (o.value)
    return;
  const { publicClient: e } = I(f(t.chains), [D({ projectId: t.projectId })]), n = $({
    autoConnect: t.autoConnect,
    connectors: G({
      projectId: t.projectId,
      version: 2,
      chains: f(t.chains)
    }),
    publicClient: e
  });
  x((i) => {
    var p;
    (p = i.chain) != null && p.unsupported && (i.chain.name = "Unsupported"), c.bufferChain = i.chain || null;
  }), P((i) => {
    d.bufferAccount = i.address ? i : null;
  }), g([() => d.bufferAccount, () => c.bufferChain], J);
  const a = new _(n, f(t.chains));
  w.client = a, L(a);
}
function oe(e) {
  return {
    install() {
      W(e), b();
    }
  };
}
async function ce(e) {
  return E({
    chainId: e.chainId || h.value.id,
    address: e.address,
    abi: e.abi,
    functionName: e.functionName,
    args: e.args || [],
    account: e.account || l.address,
    blockNumber: e.blockNumber,
    blockTag: e.blockTag
  });
}
async function re(e) {
  const { hash: n } = await F({
    chainId: e.chainId || h.value.id,
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
  return N({
    chainId: e.chainId || h.value.id,
    hash: n,
    confirmations: e.confirmations || 1
  });
}
async function le(e) {
  return await S({ chainId: e.chainId || h.value.id }).estimateContractGas({
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
async function ue(e) {
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
  }), await U({
    chainId: e.chainId,
    contracts: n,
    multicallAddress: e.multicallAddress,
    blockTag: e.blockTag,
    blockNumber: e.blockNumber,
    batchSize: e.batchSize,
    allowFailure: e.allowFailure
  });
}
const de = [
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
], pe = [
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
  ae as $off,
  te as $on,
  K as Chains,
  s as Events,
  l as account,
  se as accountDetails,
  h as chain,
  ie as connect,
  oe as createWeb3Auth,
  R as disconnect,
  de as erc20ABI,
  le as estimateWriteContractGas,
  B as getAvailableChains,
  ue as multicall,
  pe as multicallABI,
  ce as readContract,
  ne as selectChain,
  z as shortAddressFilter,
  ee as switchChain,
  re as writeContract
};
