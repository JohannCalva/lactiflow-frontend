import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        // Bootstrap 5.3's own SCSS still uses the legacy @import syntax and
        // legacy color functions internally; silence deprecation warnings
        // that come from node_modules, not from our own theme.scss.
        quietDeps: true,
        // Bootstrap 5.3 has no @use-compatible entry point yet (that's a
        // Bootstrap 6 change), so theme.scss's own `@import "bootstrap/..."`
        // is unavoidable — silence just that one warning category.
        silenceDeprecations: ["import"],
      },
    },
  },
})
