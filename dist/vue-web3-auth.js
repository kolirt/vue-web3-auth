import * as J from "@wagmi/core/chains";
import { reactive as m, computed as k, ref as M, watch as g, toRaw as h } from "vue";
import { disconnect as v, configureChains as $, createConfig as I, watchNetwork as E, watchAccount as x, readContract as N, writeContract as S, waitForTransaction as U, multicall as D } from "@wagmi/core";
import { w3mProvider as F, w3mConnectors as _, EthereumClient as j } from "@web3modal/ethereum";
import { Web3Modal as P } from "@web3modal/html";
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
const V = H, t = m({
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
function G(e) {
  "autoInit" in e && (t.autoInit = e.autoInit), "projectId" in e && (t.projectId = e.projectId), "chains" in e && (t.chains = e.chains), "autoConnect" in e && (t.autoConnect = e.autoConnect), "disconnectUnknownChain" in e && (t.disconnectUnknownChain = e.disconnectUnknownChain), "reconnectToChain" in e && (t.reconnectToChain = e.reconnectToChain), "logEnabled" in e && (t.logEnabled = e.logEnabled), "web3modalOptions" in e && ("themeMode" in e.web3modalOptions && (t.web3modalOptions.themeMode = e.web3modalOptions.themeMode), "themeVariables" in e.web3modalOptions && (t.web3modalOptions.themeVariables = e.web3modalOptions.themeVariables));
}
const c = m({
  bufferChain: null,
  currentChain: null
}), f = k(() => c.currentChain ? c.currentChain : t.chains[0]);
function O() {
  return t.chains;
}
async function B(e) {
  var n;
  o.value || b(), await ((n = w.client) == null ? void 0 : n.switchNetwork({ chainId: e.id }));
}
async function ee() {
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
function l(e, ...n) {
  e === s.Connected || e === s.Disconnected ? (c.currentChain = c.bufferChain, d.currentAccount = d.bufferAccount) : e === s.ChainSwitched && (c.currentChain = c.bufferChain), T.emit(e, null, ...n);
}
function ne(e, n) {
  T.on(e, n), t.logEnabled && r(`Subscribe for ${e} event.`);
}
function te(e, n) {
  T.detach(e, n), t.logEnabled && r(`Unsubscribe for ${e} event.`);
}
const o = M(null);
function W(e) {
  var n;
  o.value = new P(
    {
      projectId: t.projectId,
      ...(t == null ? void 0 : t.web3modalOptions) || []
    },
    e
  ), (n = o.value) == null || n.subscribeModal(({ open: a }) => {
    l(s.ModalStateChanged, a);
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
  await v();
}
async function ae(e) {
  var n, a;
  o.value || b(), e instanceof Event && (e = t.chains[0]), (n = o.value) == null || n.setDefaultChain(e || t.chains[0]), await ((a = o.value) == null ? void 0 : a.openModal({
    route: "ConnectWallet"
  }));
}
async function ie() {
  var e;
  o.value || b(), await ((e = o.value) == null ? void 0 : e.openModal({
    route: "Account"
  }));
}
function R(e = "") {
  return `${e.slice(0, 5)}...${e.slice(-4)}`;
}
g(() => d.currentAccount, (e) => {
  e ? (u.connected = !0, u.address = e.address, u.shortAddress = R(e.address)) : (u.connected = !1, u.address = void 0, u.shortAddress = void 0);
});
let C;
const w = m({
  client: null
});
function y(e) {
  return String(e).toLowerCase();
}
async function z([e, n], [a, i]) {
  if (t.disconnectUnknownChain && (!a && t.disconnectUnknownChain || a) && n && !t.chains.some((p) => p.id === n.id)) {
    await L(), i && (l(s.Disconnected), r(`account ${e.address} disconnected from ${y(i.name)} chain.`)), l(s.UnknownChain, { chain: n }), r("switched to unsupported chain.");
    return;
  }
  (a == null ? void 0 : a.address) !== (e == null ? void 0 : e.address) && !(i != null && i.unsupported) && (a && (l(s.Disconnected), r(`account ${a.address} disconnected from ${y(i.name)} chain.`)), e && (l(s.Connected, { chain: c.bufferChain, account: d.bufferAccount }), r(`account ${e.address} connected to ${y(n.name)} chain.`))), i && n && i.id !== n.id && (t.reconnectToChain ? (l(s.Disconnected), r(`account ${a.address} disconnected from ${y(i.name)} chain.`), l(s.Connected, { chain: c.bufferChain, account: d.bufferAccount }), r(`account ${e.address} connected to ${y(n.name)} chain.`)) : (l(s.ChainSwitched, { chain: n }), r(`account ${e.address} switched to ${y(n.name)} chain.`)));
}
function q([e, n], [a, i]) {
  clearTimeout(C), C = setTimeout(z, 200, [e, n], [a, i]);
}
function b() {
  if (o.value)
    return;
  const { publicClient: e } = $(h(t.chains), [F({ projectId: t.projectId })]), n = I({
    autoConnect: t.autoConnect,
    connectors: _({
      projectId: t.projectId,
      version: 2,
      chains: h(t.chains)
    }),
    publicClient: e
  });
  E((i) => {
    var p;
    (p = i.chain) != null && p.unsupported && (i.chain.name = "Unsupported"), c.bufferChain = i.chain || null;
  }), x((i) => {
    d.bufferAccount = i.address ? i : null;
  }), g([() => d.bufferAccount, () => c.bufferChain], q);
  const a = new j(n, h(t.chains));
  w.client = a, W(a);
}
function se(e) {
  return {
    install() {
      G(e), b();
    }
  };
}
async function oe(e) {
  return N({
    chainId: e.chainId || f.value.id,
    address: e.address,
    abi: e.abi,
    functionName: e.functionName,
    args: e.args || [],
    account: e.account || u.address,
    blockNumber: e.blockNumber,
    blockTag: e.blockTag
  });
}
async function ce(e) {
  const { hash: n } = await S({
    chainId: e.chainId || f.value.id,
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
  return U({
    chainId: e.chainId || f.value.id,
    hash: n,
    confirmations: e.confirmations || 1
  });
}
async function re(e) {
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
  }), await D({
    chainId: e.chainId,
    contracts: n,
    multicallAddress: e.multicallAddress,
    blockTag: e.blockTag,
    blockNumber: e.blockNumber,
    batchSize: e.batchSize,
    allowFailure: e.allowFailure
  });
}
const le = [
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
], ue = [
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
  te as $off,
  ne as $on,
  J as Chains,
  s as Events,
  u as account,
  ie as accountDetails,
  f as chain,
  ae as connect,
  se as createWeb3Auth,
  L as disconnect,
  le as erc20ABI,
  O as getAvailableChains,
  re as multicall,
  ue as multicallABI,
  oe as readContract,
  ee as selectChain,
  R as shortAddressFilter,
  B as switchChain,
  ce as writeContract
};
