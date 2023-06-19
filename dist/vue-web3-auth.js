import * as z from "@wagmi/core/chains";
import { reactive as b, computed as w, ref as $, watch as g, toRaw as y } from "vue";
import { disconnect as T, configureChains as M, createConfig as E, watchNetwork as I, watchAccount as v, multicall as S } from "@wagmi/core";
import { w3mProvider as U, w3mConnectors as D, EthereumClient as j } from "@web3modal/ethereum";
import { Web3Modal as N } from "@web3modal/html";
import x from "js-event-bus";
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
const F = H, e = b({
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
function W(t) {
  "autoInit" in t && (e.autoInit = t.autoInit), "projectId" in t && (e.projectId = t.projectId), "chains" in t && (e.chains = t.chains), "autoConnect" in t && (e.autoConnect = t.autoConnect), "disconnectUnknownChain" in t && (e.disconnectUnknownChain = t.disconnectUnknownChain), "reconnectToChain" in t && (e.reconnectToChain = t.reconnectToChain), "logEnabled" in t && (e.logEnabled = t.logEnabled), "web3modalOptions" in t && ("themeMode" in t.web3modalOptions && (e.web3modalOptions.themeMode = t.web3modalOptions.themeMode), "themeVariables" in t.web3modalOptions && (e.web3modalOptions.themeVariables = t.web3modalOptions.themeVariables));
}
const s = b({
  bufferChain: null,
  currentChain: null
}), Q = w(() => s.currentChain ? s.currentChain : e.chains[0]);
function X() {
  return e.chains;
}
async function Y(t) {
  var n;
  o.value || p(), await ((n = k.client) == null ? void 0 : n.switchNetwork({ chainId: t.id }));
}
async function Z() {
  var t;
  o.value || p(), await ((t = o.value) == null ? void 0 : t.openModal({
    route: "SelectNetwork"
  }));
}
function l(...t) {
  e.logEnabled && console.log("[WC]", ...t);
}
var c = /* @__PURE__ */ ((t) => (t.Connected = "connected", t.Disconnected = "disconnect", t.ChainSwitched = "chain_switched", t.UnknownChain = "unknown_chain", t.ModalStateChanged = "modal_state_changed", t))(c || {});
const C = new x();
function d(t, ...n) {
  t === c.Connected || t === c.Disconnected ? (s.currentChain = s.bufferChain, r.currentAccount = r.bufferAccount) : t === c.ChainSwitched && (s.currentChain = s.bufferChain), C.emit(t, null, ...n);
}
function O(t, n) {
  C.on(t, n), e.logEnabled && l(`Subscribe for ${t} event.`);
}
function B(t, n) {
  C.detach(t, n), e.logEnabled && l(`Unsubscribe for ${t} event.`);
}
const o = $(null);
function A(t) {
  var n;
  o.value = new N(
    {
      projectId: e.projectId,
      ...(e == null ? void 0 : e.web3modalOptions) || []
    },
    t
  ), (n = o.value) == null || n.subscribeModal(({ open: a }) => {
    d(c.ModalStateChanged, a);
  });
}
const r = b({
  bufferAccount: null,
  currentAccount: null
}), h = b({
  connected: !1,
  address: void 0,
  shortAddress: void 0
});
async function L() {
  await T();
}
async function tt(t) {
  var n, a;
  o.value || p(), t instanceof Event && (t = e.chains[0]), (n = o.value) == null || n.setDefaultChain(t || e.chains[0]), await ((a = o.value) == null ? void 0 : a.openModal({
    route: "ConnectWallet"
  }));
}
async function nt() {
  var t;
  o.value || p(), await ((t = o.value) == null ? void 0 : t.openModal({
    route: "Account"
  }));
}
function V(t = "") {
  return `${t.slice(0, 5)}...${t.slice(-4)}`;
}
g(() => r.currentAccount, (t) => {
  t ? (h.connected = !0, h.address = t.address, h.shortAddress = V(t.address)) : (h.connected = !1, h.address = void 0, h.shortAddress = void 0);
});
let f;
const k = b({
  client: null
});
function m(t) {
  return String(t).toLowerCase();
}
async function _([t, n], [a, i]) {
  if (e.disconnectUnknownChain && (!a && e.disconnectUnknownChain || a) && n && !e.chains.some((u) => u.id === n.id)) {
    await L(), i && (d(c.Disconnected), l(`account ${t.address} disconnected from ${m(i.name)} chain.`)), d(c.UnknownChain, { chain: n }), l("switched to unsupported chain.");
    return;
  }
  (a == null ? void 0 : a.address) !== (t == null ? void 0 : t.address) && !(i != null && i.unsupported) && (a && (d(c.Disconnected), l(`account ${a.address} disconnected from ${m(i.name)} chain.`)), t && (d(c.Connected, { chain: s.bufferChain, account: r.bufferAccount }), l(`account ${t.address} connected to ${m(n.name)} chain.`))), i && n && i.id !== n.id && (e.reconnectToChain ? (d(c.Disconnected), l(`account ${a.address} disconnected from ${m(i.name)} chain.`), d(c.Connected, { chain: s.bufferChain, account: r.bufferAccount }), l(`account ${t.address} connected to ${m(n.name)} chain.`)) : (d(c.ChainSwitched, { chain: n }), l(`account ${t.address} switched to ${m(n.name)} chain.`)));
}
function R([t, n], [a, i]) {
  clearTimeout(f), f = setTimeout(_, 200, [t, n], [a, i]);
}
function p() {
  if (o.value)
    return;
  const { publicClient: t } = M(y(e.chains), [U({ projectId: e.projectId })]), n = E({
    autoConnect: e.autoConnect,
    connectors: D({
      projectId: e.projectId,
      version: 2,
      chains: y(e.chains)
    }),
    publicClient: t
  });
  I((i) => {
    var u;
    (u = i.chain) != null && u.unsupported && (i.chain.name = "Unsupported"), s.bufferChain = i.chain || null;
  }), v((i) => {
    r.bufferAccount = i.address ? i : null;
  }), g([() => r.bufferAccount, () => s.bufferChain], R);
  const a = new j(n, y(e.chains));
  k.client = a, A(a);
}
function et(t) {
  return {
    install() {
      W(t), p();
    }
  };
}
const at = [
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
async function it(t) {
  const n = [];
  return t.calls.forEach((a) => {
    a.calls.forEach(([i, u]) => {
      n.push({
        address: a.contractAddress,
        abi: a.abi,
        functionName: i,
        args: u
      });
    });
  }), await S({
    chainId: t.chainId,
    contracts: n,
    multicallAddress: t.multicallAddress,
    blockTag: t.blockTag,
    blockNumber: t.blockNumber,
    batchSize: t.batchSize,
    allowFailure: t.allowFailure
  });
}
export {
  B as $off,
  O as $on,
  z as Chains,
  c as Event,
  at as MulticallAbi,
  h as account,
  nt as accountDetails,
  Q as chain,
  tt as connect,
  et as createWeb3Auth,
  L as disconnect,
  X as getAvailableChains,
  it as multicall,
  Z as selectChain,
  V as shortAddressFilter,
  Y as switchChain
};
