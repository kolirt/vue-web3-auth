import { resolve } from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import eslint from 'vite-plugin-eslint'
import pkg from './package.json'

export default defineConfig({
  plugins: [
    dts({
      tsConfigFilePath: './tsconfig.json',
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
      external: [...Object.keys(pkg.dependencies)],
      output: {
        globals: {
          ...(() => {
            const obj: Record<string, string> = {}
            Object.keys(pkg.dependencies).forEach((key) => {
              obj[key] = key
            })
            return obj
          })()
        }
      }
    }
  }
})
