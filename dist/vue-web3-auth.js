import * as Y from "@wagmi/core/chains";
import { reactive as m, computed as v, ref as w, watch as C, toRaw as f } from "vue";
import { disconnect as g, configureChains as k, createConfig as I, watchNetwork as x, watchAccount as $, readContract as E, multicall as S } from "@wagmi/core";
import { w3mProvider as U, w3mConnectors as _, EthereumClient as D } from "@web3modal/ethereum";
import { Web3Modal as N } from "@web3modal/html";
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
const L = A, n = m({
  autoInit: !0,
  projectId: "",
  chains: [L],
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
const o = m({
  bufferChain: null,
  currentChain: null
}), R = v(() => o.currentChain ? o.currentChain : n.chains[0]);
function O() {
  return n.chains;
}
async function X(e) {
  var t;
  u.value || b(), await ((t = M.client) == null ? void 0 : t.switchNetwork({ chainId: e.id }));
}
async function Z() {
  var e;
  u.value || b(), await ((e = u.value) == null ? void 0 : e.openModal({
    route: "SelectNetwork"
  }));
}
function l(...e) {
  n.logEnabled && console.log("[WC]", ...e);
}
var s = /* @__PURE__ */ ((e) => (e.Connected = "connected", e.Disconnected = "disconnect", e.ChainSwitched = "chain_switched", e.UnknownChain = "unknown_chain", e.ModalStateChanged = "modal_state_changed", e))(s || {});
const h = new j();
function r(e, ...t) {
  e === s.Connected || e === s.Disconnected ? (o.currentChain = o.bufferChain, c.currentAccount = c.bufferAccount) : e === s.ChainSwitched && (o.currentChain = o.bufferChain), h.emit(e, null, ...t);
}
function B(e, t) {
  h.on(e, t), n.logEnabled && l(`Subscribe for ${e} event.`);
}
function ee(e, t) {
  h.detach(e, t), n.logEnabled && l(`Unsubscribe for ${e} event.`);
}
const u = w(null);
function F(e) {
  var t;
  u.value = new N(
    {
      projectId: n.projectId,
      ...(n == null ? void 0 : n.web3modalOptions) || []
    },
    e
  ), (t = u.value) == null || t.subscribeModal(({ open: a }) => {
    r(s.ModalStateChanged, a);
  });
}
const c = m({
  bufferAccount: null,
  currentAccount: null
}), p = m({
  connected: !1,
  address: void 0,
  shortAddress: void 0
});
async function W() {
  await g();
}
async function te(e) {
  var t, a;
  u.value || b(), e instanceof Event && (e = n.chains[0]), (t = u.value) == null || t.setDefaultChain(e || n.chains[0]), await ((a = u.value) == null ? void 0 : a.openModal({
    route: "ConnectWallet"
  }));
}
async function ne() {
  var e;
  u.value || b(), await ((e = u.value) == null ? void 0 : e.openModal({
    route: "Account"
  }));
}
function P(e = "") {
  return `${e.slice(0, 5)}...${e.slice(-4)}`;
}
C(() => c.currentAccount, (e) => {
  e ? (p.connected = !0, p.address = e.address, p.shortAddress = P(e.address)) : (p.connected = !1, p.address = void 0, p.shortAddress = void 0);
});
let T;
const M = m({
  client: null
});
function y(e) {
  return String(e).toLowerCase();
}
async function V([e, t], [a, i]) {
  if (n.disconnectUnknownChain && (!a && n.disconnectUnknownChain || a) && t && !n.chains.some((d) => d.id === t.id)) {
    await W(), i && (r(s.Disconnected), l(`account ${e.address} disconnected from ${y(i.name)} chain.`)), r(s.UnknownChain, { chain: t }), l("switched to unsupported chain.");
    return;
  }
  (a == null ? void 0 : a.address) !== (e == null ? void 0 : e.address) && !(i != null && i.unsupported) && (a && (r(s.Disconnected), l(`account ${a.address} disconnected from ${y(i.name)} chain.`)), e && (r(s.Connected, { chain: o.bufferChain, account: c.bufferAccount }), l(`account ${e.address} connected to ${y(t.name)} chain.`))), i && t && i.id !== t.id && (n.reconnectToChain ? (r(s.Disconnected), l(`account ${a.address} disconnected from ${y(i.name)} chain.`), r(s.Connected, { chain: o.bufferChain, account: c.bufferAccount }), l(`account ${e.address} connected to ${y(t.name)} chain.`)) : (r(s.ChainSwitched, { chain: t }), l(`account ${e.address} switched to ${y(t.name)} chain.`)));
}
function z([e, t], [a, i]) {
  clearTimeout(T), T = setTimeout(V, 200, [e, t], [a, i]);
}
function b() {
  if (u.value)
    return;
  const { publicClient: e } = k(f(n.chains), [U({ projectId: n.projectId })]), t = I({
    autoConnect: n.autoConnect,
    connectors: _({
      projectId: n.projectId,
      version: 2,
      chains: f(n.chains)
    }),
    publicClient: e
  });
  x((i) => {
    var d;
    (d = i.chain) != null && d.unsupported && (i.chain.name = "Unsupported"), o.bufferChain = i.chain || null;
  }), $((i) => {
    c.bufferAccount = i.address ? i : null;
  }), C([() => c.bufferAccount, () => o.bufferChain], z);
  const a = new D(t, f(n.chains));
  M.client = a, F(a);
}
function ae(e) {
  return {
    install() {
      H(e), b();
    }
  };
}
async function ie(e) {
  return E({
    chainId: e.chain || R.value.id,
    address: e.address,
    abi: e.abi,
    functionName: e.functionName,
    args: e.args || [],
    account: p.address,
    blockNumber: e.blockNumber,
    blockTag: e.blockTag
  });
}
async function se(e) {
  const t = [];
  return e.calls.forEach((a) => {
    a.calls.forEach(([i, d]) => {
      t.push({
        address: a.contractAddress,
        abi: a.abi,
        functionName: i,
        args: d
      });
    });
  }), await S({
    chainId: e.chainId,
    contracts: t,
    multicallAddress: e.multicallAddress,
    blockTag: e.blockTag,
    blockNumber: e.blockNumber,
    batchSize: e.batchSize,
    allowFailure: e.allowFailure
  });
}
const ue = [
  {
    inputs: [],
    payable: !1,
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    anonymous: !1,
    inputs: [
      {
        indexed: !0,
        internalType: "address",
        name: "owner",
        type: "address"
      },
      {
        indexed: !0,
        internalType: "address",
        name: "spender",
        type: "address"
      },
      {
        indexed: !1,
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "Approval",
    type: "event"
  },
  {
    anonymous: !1,
    inputs: [
      {
        indexed: !0,
        internalType: "address",
        name: "sender",
        type: "address"
      },
      {
        indexed: !1,
        internalType: "uint256",
        name: "amount0",
        type: "uint256"
      },
      {
        indexed: !1,
        internalType: "uint256",
        name: "amount1",
        type: "uint256"
      },
      {
        indexed: !0,
        internalType: "address",
        name: "to",
        type: "address"
      }
    ],
    name: "Burn",
    type: "event"
  },
  {
    anonymous: !1,
    inputs: [
      {
        indexed: !0,
        internalType: "address",
        name: "sender",
        type: "address"
      },
      {
        indexed: !1,
        internalType: "uint256",
        name: "amount0",
        type: "uint256"
      },
      {
        indexed: !1,
        internalType: "uint256",
        name: "amount1",
        type: "uint256"
      }
    ],
    name: "Mint",
    type: "event"
  },
  {
    anonymous: !1,
    inputs: [
      {
        indexed: !0,
        internalType: "address",
        name: "sender",
        type: "address"
      },
      {
        indexed: !1,
        internalType: "uint256",
        name: "amount0In",
        type: "uint256"
      },
      {
        indexed: !1,
        internalType: "uint256",
        name: "amount1In",
        type: "uint256"
      },
      {
        indexed: !1,
        internalType: "uint256",
        name: "amount0Out",
        type: "uint256"
      },
      {
        indexed: !1,
        internalType: "uint256",
        name: "amount1Out",
        type: "uint256"
      },
      {
        indexed: !0,
        internalType: "address",
        name: "to",
        type: "address"
      }
    ],
    name: "Swap",
    type: "event"
  },
  {
    anonymous: !1,
    inputs: [
      {
        indexed: !1,
        internalType: "uint112",
        name: "reserve0",
        type: "uint112"
      },
      {
        indexed: !1,
        internalType: "uint112",
        name: "reserve1",
        type: "uint112"
      }
    ],
    name: "Sync",
    type: "event"
  },
  {
    anonymous: !1,
    inputs: [
      {
        indexed: !0,
        internalType: "address",
        name: "from",
        type: "address"
      },
      {
        indexed: !0,
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        indexed: !1,
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "Transfer",
    type: "event"
  },
  {
    constant: !0,
    inputs: [],
    name: "DOMAIN_SEPARATOR",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32"
      }
    ],
    payable: !1,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: !0,
    inputs: [],
    name: "MINIMUM_LIQUIDITY",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    payable: !1,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: !0,
    inputs: [],
    name: "PERMIT_TYPEHASH",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32"
      }
    ],
    payable: !1,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: !0,
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      },
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    payable: !1,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: !1,
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    payable: !1,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: !0,
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    payable: !1,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: !1,
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address"
      }
    ],
    name: "burn",
    outputs: [
      {
        internalType: "uint256",
        name: "amount0",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "amount1",
        type: "uint256"
      }
    ],
    payable: !1,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: !0,
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8"
      }
    ],
    payable: !1,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: !0,
    inputs: [],
    name: "factory",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    payable: !1,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: !0,
    inputs: [],
    name: "getReserves",
    outputs: [
      {
        internalType: "uint112",
        name: "_reserve0",
        type: "uint112"
      },
      {
        internalType: "uint112",
        name: "_reserve1",
        type: "uint112"
      },
      {
        internalType: "uint32",
        name: "_blockTimestampLast",
        type: "uint32"
      }
    ],
    payable: !1,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: !1,
    inputs: [
      {
        internalType: "address",
        name: "_token0",
        type: "address"
      },
      {
        internalType: "address",
        name: "_token1",
        type: "address"
      }
    ],
    name: "initialize",
    outputs: [],
    payable: !1,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: !0,
    inputs: [],
    name: "kLast",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    payable: !1,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: !1,
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address"
      }
    ],
    name: "mint",
    outputs: [
      {
        internalType: "uint256",
        name: "liquidity",
        type: "uint256"
      }
    ],
    payable: !1,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: !0,
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string"
      }
    ],
    payable: !1,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: !0,
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    name: "nonces",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    payable: !1,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: !1,
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address"
      },
      {
        internalType: "address",
        name: "spender",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "deadline",
        type: "uint256"
      },
      {
        internalType: "uint8",
        name: "v",
        type: "uint8"
      },
      {
        internalType: "bytes32",
        name: "r",
        type: "bytes32"
      },
      {
        internalType: "bytes32",
        name: "s",
        type: "bytes32"
      }
    ],
    name: "permit",
    outputs: [],
    payable: !1,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: !0,
    inputs: [],
    name: "price0CumulativeLast",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    payable: !1,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: !0,
    inputs: [],
    name: "price1CumulativeLast",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    payable: !1,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: !1,
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address"
      }
    ],
    name: "skim",
    outputs: [],
    payable: !1,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: !1,
    inputs: [
      {
        internalType: "uint256",
        name: "amount0Out",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "amount1Out",
        type: "uint256"
      },
      {
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes"
      }
    ],
    name: "swap",
    outputs: [],
    payable: !1,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: !0,
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string"
      }
    ],
    payable: !1,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: !1,
    inputs: [],
    name: "sync",
    outputs: [],
    payable: !1,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: !0,
    inputs: [],
    name: "token0",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    payable: !1,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: !0,
    inputs: [],
    name: "token1",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    payable: !1,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: !0,
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    payable: !1,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: !0,
    inputs: [],
    name: "totalBurned",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    payable: !1,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: !1,
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    payable: !1,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: !1,
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address"
      },
      {
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    payable: !1,
    stateMutability: "nonpayable",
    type: "function"
  }
], oe = [
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
  Y as Chains,
  s as Events,
  p as account,
  ne as accountDetails,
  R as chain,
  te as connect,
  ae as createWeb3Auth,
  W as disconnect,
  ue as erc20ABI,
  O as getAvailableChains,
  se as multicall,
  oe as multicallABI,
  ie as readContract,
  Z as selectChain,
  P as shortAddressFilter,
  X as switchChain
};
