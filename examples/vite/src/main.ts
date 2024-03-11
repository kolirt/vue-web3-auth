import App from './App.vue'

import { Chains, createWeb3Auth } from '@kolirt/vue-web3-auth'
import 'bootstrap/dist/css/bootstrap.min.css'
import { createApp } from 'vue'

const app = createApp(App)

app.use(
  createWeb3Auth({
    projectId: '', // generate here https://cloud.walletconnect.com/ and turn on 'Supports Sign v2'
    chains: [Chains.bsc, Chains.mainnet, Chains.polygon]
  })
)

app.mount('#app')
