import App from './App.vue'

import { Chains, createWeb3Auth } from '@kolirt/vue-web3-auth'
import 'bootstrap/dist/css/bootstrap.min.css'
import { createApp } from 'vue'

const app = createApp(App)

app.use(
  createWeb3Auth({
    projectId: '3c5c8069ff37304cc62e07ae8cb592a8', // generate here https://cloud.walletconnect.com/ and turn on 'Supports Sign v2'
    logEnabled: true,
    chains: [
      Chains.bsc,
      Chains.mainnet,
      Chains.polygon,
      Chains.avalanche,
      Chains.polygonMumbai,
      Chains.sepolia,
      Chains.linea,
      Chains.bscTestnet
    ]
  })
)

app.mount('#app')
