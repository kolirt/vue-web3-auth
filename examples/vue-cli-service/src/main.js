import { Chains, createWeb3Auth } from '@kolirt/vue-web3-auth'
import { createApp } from 'vue'

import 'bootstrap/dist/css/bootstrap.min.css'

import App from './App.vue'

const app = createApp(App)

app.use(
  createWeb3Auth({
    projectId: '3c5c8069ff37304cc62e07ae8cb592a8', // generate here https://cloud.walletconnect.com/ and turn on 'Supports Sign v2'
    chains: [Chains.bsc, Chains.mainnet, Chains.polygon]
  })
)

app.mount('#app')
