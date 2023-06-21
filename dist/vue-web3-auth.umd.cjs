(function(t,T){typeof exports=="object"&&typeof module<"u"?T(exports,require("@wagmi/core/chains"),require("@wagmi/core"),require("vue"),require("@web3modal/html"),require("js-event-bus"),require("@web3modal/ethereum")):typeof define=="function"&&define.amd?define(["exports","@wagmi/core/chains","@wagmi/core","vue","@web3modal/html","js-event-bus","@web3modal/ethereum"],T):(t=typeof globalThis<"u"?globalThis:t||self,T(t["vue-web3-auth"]={},t.wagmiCoreChains,t.wagmiCore,t.vue,t.web3modalHtml,t.jsEventBus,t.web3modalEthereum))})(this,function(t,T,s,u,P,$,C){"use strict";function E(e){const n=Object.create(null,{[Symbol.toStringTag]:{value:"Module"}});if(e){for(const i in e)if(i!=="default"){const c=Object.getOwnPropertyDescriptor(e,i);Object.defineProperty(n,i,c.get?c:{enumerable:!0,get:()=>e[i]})}}return n.default=e,Object.freeze(n)}const F=E(T);var N={id:1,network:"homestead",name:"Ethereum",nativeCurrency:{name:"Ether",symbol:"ETH",decimals:18},rpcUrls:{alchemy:{http:["https://eth-mainnet.g.alchemy.com/v2"],webSocket:["wss://eth-mainnet.g.alchemy.com/v2"]},infura:{http:["https://mainnet.infura.io/v3"],webSocket:["wss://mainnet.infura.io/ws/v3"]},default:{http:["https://cloudflare-eth.com"]},public:{http:["https://cloudflare-eth.com"]}},blockExplorers:{etherscan:{name:"Etherscan",url:"https://etherscan.io"},default:{name:"Etherscan",url:"https://etherscan.io"}},contracts:{ensRegistry:{address:"0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e"},ensUniversalResolver:{address:"0xc0497E381f536Be9ce14B0dD3817cBcAe57d2F62",blockCreated:16966585},multicall3:{address:"0xca11bde05977b3631167028862be2a173976ca11",blockCreated:14353601}}};function ie(e){return e}const j=N,a=u.reactive({autoInit:!0,projectId:"",chains:[j],autoConnect:!0,disconnectUnknownChain:!0,reconnectToChain:!0,logEnabled:!1,web3modalOptions:{themeMode:"light",themeVariables:{}}});function G(e){"autoInit"in e&&(a.autoInit=e.autoInit),"projectId"in e&&(a.projectId=e.projectId),"chains"in e&&(a.chains=e.chains),"autoConnect"in e&&(a.autoConnect=e.autoConnect),"disconnectUnknownChain"in e&&(a.disconnectUnknownChain=e.disconnectUnknownChain),"reconnectToChain"in e&&(a.reconnectToChain=e.reconnectToChain),"logEnabled"in e&&(a.logEnabled=e.logEnabled),"web3modalOptions"in e&&("themeMode"in e.web3modalOptions&&(a.web3modalOptions.themeMode=e.web3modalOptions.themeMode),"themeVariables"in e.web3modalOptions&&(a.web3modalOptions.themeVariables=e.web3modalOptions.themeVariables))}function y(...e){a.logEnabled&&console.log("[WC]",...e)}var o=(e=>(e.Connected="connected",e.Disconnected="disconnect",e.ChainSwitched="chain_switched",e.UnknownChain="unknown_chain",e.ModalStateChanged="modal_state_changed",e))(o||{});let v;const k=u.reactive({client:null});function b(e){return String(e).toLowerCase()}async function U([e,n],[i,c]){if(a.disconnectUnknownChain&&(!i&&a.disconnectUnknownChain||i)&&n&&!a.chains.some(g=>g.id===n.id)){await I(),c&&(h(o.Disconnected),y(`account ${e.address} disconnected from ${b(c.name)} chain.`)),h(o.UnknownChain,{chain:n}),y("switched to unsupported chain.");return}(i==null?void 0:i.address)!==(e==null?void 0:e.address)&&!(c!=null&&c.unsupported)&&(i&&(h(o.Disconnected),y(`account ${i.address} disconnected from ${b(c.name)} chain.`)),e&&(h(o.Connected,{chain:m.bufferChain,account:p.bufferAccount}),y(`account ${e.address} connected to ${b(n.name)} chain.`))),c&&n&&c.id!==n.id&&(a.reconnectToChain?(h(o.Disconnected),y(`account ${i.address} disconnected from ${b(c.name)} chain.`),h(o.Connected,{chain:m.bufferChain,account:p.bufferAccount}),y(`account ${e.address} connected to ${b(n.name)} chain.`)):(h(o.ChainSwitched,{chain:n}),y(`account ${e.address} switched to ${b(n.name)} chain.`)))}function S([e,n],[i,c]){clearTimeout(v),v=setTimeout(U,200,[e,n],[i,c])}function f(){if(l.value)return;const{publicClient:e}=s.configureChains(u.toRaw(a.chains),[C.w3mProvider({projectId:a.projectId})]),n=s.createConfig({autoConnect:a.autoConnect,connectors:C.w3mConnectors({projectId:a.projectId,version:2,chains:u.toRaw(a.chains)}),publicClient:e});s.watchNetwork(c=>{var g;(g=c.chain)!=null&&g.unsupported&&(c.chain.name="Unsupported"),m.bufferChain=c.chain||null}),s.watchAccount(c=>{p.bufferAccount=c.address?c:null}),u.watch([()=>p.bufferAccount,()=>m.bufferChain],S);const i=new C.EthereumClient(n,u.toRaw(a.chains));k.client=i,H(i)}const p=u.reactive({bufferAccount:null,currentAccount:null}),d=u.reactive({connected:!1,address:void 0,shortAddress:void 0});async function I(){await s.disconnect()}async function D(e){var n,i;l.value||f(),e instanceof Event&&(e=a.chains[0]),(n=l.value)==null||n.setDefaultChain(e||a.chains[0]),await((i=l.value)==null?void 0:i.openModal({route:"ConnectWallet"}))}async function _(){var e;l.value||f(),await((e=l.value)==null?void 0:e.openModal({route:"Account"}))}function M(e=""){return`${e.slice(0,5)}...${e.slice(-4)}`}u.watch(()=>p.currentAccount,e=>{e?(d.connected=!0,d.address=e.address,d.shortAddress=M(e.address)):(d.connected=!1,d.address=void 0,d.shortAddress=void 0)});const w=new $;function h(e,...n){e===o.Connected||e===o.Disconnected?(m.currentChain=m.bufferChain,p.currentAccount=p.bufferAccount):e===o.ChainSwitched&&(m.currentChain=m.bufferChain),w.emit(e,null,...n)}function A(e,n){w.on(e,n),a.logEnabled&&y(`Subscribe for ${e} event.`)}function W(e,n){w.detach(e,n),a.logEnabled&&y(`Unsubscribe for ${e} event.`)}const l=u.ref(null);function H(e){var n;l.value=new P.Web3Modal({projectId:a.projectId,...(a==null?void 0:a.web3modalOptions)||[]},e),(n=l.value)==null||n.subscribeModal(({open:i})=>{h(o.ModalStateChanged,i)})}const m=u.reactive({bufferChain:null,currentChain:null}),r=u.computed(()=>m.currentChain?m.currentChain:a.chains[0]);function q(){return a.chains}async function R(e){var n;l.value||f(),await((n=k.client)==null?void 0:n.switchNetwork({chainId:e.id}))}async function V(){var e;l.value||f(),await((e=l.value)==null?void 0:e.openModal({route:"SelectNetwork"}))}function L(e){return s.fetchBalance({chainId:e.chainId||r.value.id,address:e.address,token:e.token,formatUnits:e.formatUnits})}function z(e){return s.fetchBlockNumber({chainId:(e==null?void 0:e.chainId)||r.value.id})}async function J(e){return s.readContract({chainId:e.chainId||r.value.id,address:e.address,abi:e.abi,functionName:e.functionName,args:e.args||[],account:e.account||d.address,blockNumber:e.blockNumber,blockTag:e.blockTag})}async function K(e){const{hash:n}=await s.writeContract({chainId:e.chainId||r.value.id,address:e.address,abi:e.abi,functionName:e.functionName,args:e.args||[],account:e.account||d.address,gas:e.gas,gasPrice:e.gasPrice,maxFeePerGas:e.maxFeePerGas,maxPriorityFeePerGas:e.maxPriorityFeePerGas,nonce:e.nonce,value:e.value});return s.waitForTransaction({chainId:e.chainId||r.value.id,hash:n,confirmations:e.confirmations||1})}async function O(e){return await s.getPublicClient({chainId:e.chainId||r.value.id}).estimateContractGas({address:e.address,abi:e.abi,functionName:e.functionName,args:e.args||[],account:e.account||d.address,gasPrice:e.gasPrice,maxFeePerGas:e.maxFeePerGas,maxPriorityFeePerGas:e.maxPriorityFeePerGas,nonce:e.nonce,value:e.value})}function Q(e,n){return s.watchContractEvent({chainId:(e==null?void 0:e.chainId)||r.value.id,address:e.address,abi:e.abi,eventName:e.eventName},n)}function X(e){return s.fetchFeeData({chainId:(e==null?void 0:e.chainId)||r.value.id,formatUnits:e==null?void 0:e.formatUnits})}function Y(e){return s.signMessage({message:e})}async function Z(e){const n=[];return e.calls.forEach(i=>{i.calls.forEach(([c,g])=>{n.push({address:i.contractAddress,abi:i.abi,functionName:c,args:g})})}),await s.multicall({chainId:e.chainId,contracts:n,multicallAddress:e.multicallAddress,blockTag:e.blockTag,blockNumber:e.blockNumber,batchSize:e.batchSize,allowFailure:e.allowFailure})}function x(e){return s.fetchToken({chainId:e.chainId||r.value.id,address:e.address,formatUnits:e.formatUnits})}function B(e){return s.fetchTransaction({chainId:e.chainId||r.value.id,hash:e.hash})}async function ee(e){const{hash:n}=await s.sendTransaction({chainId:e.chainId||r.value.id,to:e.to,account:e.account,gas:e.gas,gasPrice:e.gasPrice,maxFeePerGas:e.maxFeePerGas,maxPriorityFeePerGas:e.maxPriorityFeePerGas,nonce:e.nonce,value:e.value});return s.waitForTransaction({chainId:e.chainId||r.value.id,hash:n,confirmations:e.confirmations||1})}const ne=[{inputs:[{internalType:"string",name:"name_",type:"string"},{internalType:"string",name:"symbol_",type:"string"},{internalType:"uint8",name:"decimals_",type:"uint8"},{internalType:"uint256",name:"initialBalance_",type:"uint256"},{internalType:"address payable",name:"feeReceiver_",type:"address"}],stateMutability:"payable",type:"constructor"},{anonymous:!1,inputs:[{indexed:!0,internalType:"address",name:"owner",type:"address"},{indexed:!0,internalType:"address",name:"spender",type:"address"},{indexed:!1,internalType:"uint256",name:"value",type:"uint256"}],name:"Approval",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"address",name:"from",type:"address"},{indexed:!0,internalType:"address",name:"to",type:"address"},{indexed:!1,internalType:"uint256",name:"value",type:"uint256"}],name:"Transfer",type:"event"},{inputs:[{internalType:"address",name:"owner",type:"address"},{internalType:"address",name:"spender",type:"address"}],name:"allowance",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"spender",type:"address"},{internalType:"uint256",name:"amount",type:"uint256"}],name:"approve",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"account",type:"address"}],name:"balanceOf",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[],name:"decimals",outputs:[{internalType:"uint8",name:"",type:"uint8"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"spender",type:"address"},{internalType:"uint256",name:"subtractedValue",type:"uint256"}],name:"decreaseAllowance",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"spender",type:"address"},{internalType:"uint256",name:"addedValue",type:"uint256"}],name:"increaseAllowance",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"nonpayable",type:"function"},{inputs:[],name:"name",outputs:[{internalType:"string",name:"",type:"string"}],stateMutability:"view",type:"function"},{inputs:[],name:"symbol",outputs:[{internalType:"string",name:"",type:"string"}],stateMutability:"view",type:"function"},{inputs:[],name:"totalSupply",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"recipient",type:"address"},{internalType:"uint256",name:"amount",type:"uint256"}],name:"transfer",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"sender",type:"address"},{internalType:"address",name:"recipient",type:"address"},{internalType:"uint256",name:"amount",type:"uint256"}],name:"transferFrom",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"nonpayable",type:"function"}],te=[{inputs:[{components:[{internalType:"address",name:"target",type:"address"},{internalType:"bytes",name:"callData",type:"bytes"}],internalType:"struct Multicall.Call[]",name:"calls",type:"tuple[]"}],name:"aggregate",outputs:[{internalType:"uint256",name:"blockNumber",type:"uint256"},{internalType:"bytes[]",name:"returnData",type:"bytes[]"}],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"uint256",name:"blockNumber",type:"uint256"}],name:"getBlockHash",outputs:[{internalType:"bytes32",name:"blockHash",type:"bytes32"}],stateMutability:"view",type:"function"},{inputs:[],name:"getCurrentBlockCoinbase",outputs:[{internalType:"address",name:"coinbase",type:"address"}],stateMutability:"view",type:"function"},{inputs:[],name:"getCurrentBlockDifficulty",outputs:[{internalType:"uint256",name:"difficulty",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[],name:"getCurrentBlockGasLimit",outputs:[{internalType:"uint256",name:"gaslimit",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[],name:"getCurrentBlockTimestamp",outputs:[{internalType:"uint256",name:"timestamp",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"addr",type:"address"}],name:"getEthBalance",outputs:[{internalType:"uint256",name:"balance",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[],name:"getLastBlockHash",outputs:[{internalType:"bytes32",name:"blockHash",type:"bytes32"}],stateMutability:"view",type:"function"}];function ae(e){return{install(){G(e),f()}}}t.Chains=F,t.$off=W,t.$on=A,t.Events=o,t.account=d,t.accountDetails=_,t.chain=r,t.connect=D,t.createWeb3Auth=ae,t.disconnect=I,t.erc20ABI=ne,t.estimateWriteContractGas=O,t.fetchBalance=L,t.fetchBlockNumber=z,t.fetchGasPrice=X,t.fetchToken=x,t.fetchTransaction=B,t.getAvailableChains=q,t.init=f,t.multicall=Z,t.multicallABI=te,t.readContract=J,t.selectChain=V,t.sendTransaction=ee,t.shortAddressFilter=M,t.signMessage=Y,t.switchChain=R,t.watchContractEvent=Q,t.writeContract=K,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})});
