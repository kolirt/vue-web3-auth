import {defineConfig} from 'vite'
import {resolve} from 'path'
import dts from 'vite-plugin-dts'
import eslint from 'vite-plugin-eslint'

export default defineConfig({
    plugins: [
        dts({
            tsConfigFilePath: './tsconfig.lib.json',
            rollupTypes: true
        }),
        eslint()
    ],
    build: {
        lib: {
            name: 'vue-web3-auth',
            formats: ['es', 'umd'],
            entry: resolve(__dirname, 'lib/index.ts'),
            fileName: 'vue-web3-auth'
        },
        emptyOutDir: true,
        rollupOptions: {
            external: [
                'vue',
                'js-event-bus',
                '@wagmi/core',
                '@wagmi/core/chains',
                '@web3modal/ethereum',
                '@web3modal/html',
                'viem'
            ],
            output: {
                globals: {
                    'vue': 'vue',
                    'js-event-bus': 'jsEventBus',
                    '@wagmi/core': 'wagmiCore',
                    '@wagmi/core/chains': 'wagmiCoreChains',
                    '@web3modal/ethereum': 'web3modalEthereum',
                    '@web3modal/html': 'web3modalHtml',
                    'viem': 'viem'
                }
            }
        }
    }
})
