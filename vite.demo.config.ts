import {fileURLToPath, URL} from 'node:url'

import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import {resolve} from 'path'

export default defineConfig({
    base: '/vue-web3-auth/',
    plugins: [
        vue()
    ],
    resolve: {
        alias: {
            // @ts-ignore
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            'lib': fileURLToPath(new URL('./lib', import.meta.url)),
        }
    },
    build: {
        outDir: resolve(__dirname, './demo'),
        emptyOutDir: true,
    },
})
