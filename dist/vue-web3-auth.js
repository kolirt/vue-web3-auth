import * as P from "@wagmi/core/chains";
import { reactive as m, computed as w, ref as E, watch as k, toRaw as f } from "vue";
import { disconnect as I, configureChains as M, createConfig as y, watchNetwork as U, watchAccount as j } from "@wagmi/core";
import { w3mProvider as S, w3mConnectors as D, EthereumClient as T } from "@web3modal/ethereum";
import { Web3Modal as x } from "@web3modal/html";
import v from "js-event-bus";
var W = {
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
const V = W, e = m({
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
function _(n) {
  "autoInit" in n && (e.autoInit = n.autoInit), "projectId" in n && (e.projectId = n.projectId), "chains" in n && (e.chains = n.chains), "autoConnect" in n && (e.autoConnect = n.autoConnect), "disconnectUnknownChain" in n && (e.disconnectUnknownChain = n.disconnectUnknownChain), "reconnectToChain" in n && (e.reconnectToChain = n.reconnectToChain), "logEnabled" in n && (e.logEnabled = n.logEnabled), "web3modalOptions" in n && ("themeMode" in n.web3modalOptions && (e.web3modalOptions.themeMode = n.web3modalOptions.themeMode), "themeVariables" in n.web3modalOptions && (e.web3modalOptions.themeVariables = n.web3modalOptions.themeVariables));
}
const s = m({
  bufferChain: null,
  currentChain: null
}), K = w(() => s.currentChain ? s.currentChain : e.chains[0]);
function Q() {
  return e.chains;
}
async function X(n) {
  var t;
  i.value || b(), await ((t = p.client) == null ? void 0 : t.switchNetwork({ chainId: n.id }));
}
async function Y() {
  var n;
  i.value || b(), await ((n = i.value) == null ? void 0 : n.openModal({
    route: "SelectNetwork"
  }));
}
function d(...n) {
  e.logEnabled && console.log("[WC]", ...n);
}
var o = /* @__PURE__ */ ((n) => (n.Connected = "connected", n.Disconnected = "disconnect", n.ChainSwitched = "chain_switched", n.UnknownChain = "unknown_chain", n.ModalStateChanged = "modal_state_changed", n))(o || {});
const g = new v();
function l(n, ...t) {
  n === o.Connected || n === o.Disconnected ? (s.currentChain = s.bufferChain, r.currentAccount = r.bufferAccount) : n === o.ChainSwitched && (s.currentChain = s.bufferChain), g.emit(n, null, ...t);
}
function Z(n, t) {
  g.on(n, t), e.logEnabled && d(`Subscribe for ${n} event.`);
}
function O(n, t) {
  g.detach(n, t), e.logEnabled && d(`Unsubscribe for ${n} event.`);
}
const i = E(null);
function F(n) {
  var t;
  i.value = new x(
    {
      projectId: e.projectId,
      ...(e == null ? void 0 : e.web3modalOptions) || []
    },
    n
  ), (t = i.value) == null || t.subscribeModal(({ open: c }) => {
    l(o.ModalStateChanged, c);
  });
}
const r = m({
  bufferAccount: null,
  currentAccount: null
}), h = m({
  connected: !1,
  address: void 0,
  shortAddress: void 0
});
async function N() {
  await I();
}
async function B(n) {
  var t, c;
  i.value || b(), n instanceof Event && (n = e.chains[0]), (t = i.value) == null || t.setDefaultChain(n || e.chains[0]), await ((c = i.value) == null ? void 0 : c.openModal({
    route: "ConnectWallet"
  }));
}
async function nn() {
  var n;
  i.value || b(), await ((n = i.value) == null ? void 0 : n.openModal({
    route: "Account"
  }));
}
function R(n = "") {
  return `${n.slice(0, 5)}...${n.slice(-4)}`;
}
k(() => r.currentAccount, (n) => {
  n ? (h.connected = !0, h.address = n.address, h.shortAddress = R(n.address)) : (h.connected = !1, h.address = void 0, h.shortAddress = void 0);
});
let $;
const p = m({
  client: null
});
function u(n) {
  return String(n).toLowerCase();
}
async function H([n, t], [c, a]) {
  if (e.disconnectUnknownChain && (!c && e.disconnectUnknownChain || c) && t && !e.chains.some((C) => C.id === t.id)) {
    await N(), a && (l(o.Disconnected), d(`account ${n.address} disconnected from ${u(a.name)} chain.`)), l(o.UnknownChain, { chain: t }), d("switched to unsupported chain.");
    return;
  }
  (c == null ? void 0 : c.address) !== (n == null ? void 0 : n.address) && !(a != null && a.unsupported) && (c && (l(o.Disconnected), d(`account ${c.address} disconnected from ${u(a.name)} chain.`)), n && (l(o.Connected, { chain: s.bufferChain, account: r.bufferAccount }), d(`account ${n.address} connected to ${u(t.name)} chain.`))), a && t && a.id !== t.id && (e.reconnectToChain ? (l(o.Disconnected), d(`account ${c.address} disconnected from ${u(a.name)} chain.`), l(o.Connected, { chain: s.bufferChain, account: r.bufferAccount }), d(`account ${n.address} connected to ${u(t.name)} chain.`)) : (l(o.ChainSwitched, { chain: t }), d(`account ${n.address} switched to ${u(t.name)} chain.`)));
}
function L([n, t], [c, a]) {
  clearTimeout($), $ = setTimeout(H, 200, [n, t], [c, a]);
}
function b() {
  if (i.value)
    return;
  const { publicClient: n } = M(f(e.chains), [S({ projectId: e.projectId })]), t = y({
    autoConnect: e.autoConnect,
    connectors: D({
      projectId: e.projectId,
      version: 2,
      chains: f(e.chains)
    }),
    publicClient: n
  });
  U((a) => {
    var C;
    (C = a.chain) != null && C.unsupported && (a.chain.name = "Unsupported"), s.bufferChain = a.chain || null;
  }), j((a) => {
    r.bufferAccount = a.address ? a : null;
  }), k([() => r.bufferAccount, () => s.bufferChain], L);
  const c = new T(t, f(e.chains));
  p.client = c, F(c);
}
function en(n) {
  return {
    install() {
      _(n), b();
    }
  };
}
export {
  O as $off,
  Z as $on,
  P as Chains,
  o as Event,
  h as account,
  nn as accountDetails,
  K as chain,
  B as connect,
  en as createWeb3Auth,
  N as disconnect,
  Q as getAvailableChains,
  Y as selectChain,
  R as shortAddressFilter,
  X as switchChain
};
