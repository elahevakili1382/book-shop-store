// vitest.config.ts
import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.ts', // اگر setup داری
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './app'),
      '#app': path.resolve(__dirname, './.nuxt/app')
    }
  }
})
