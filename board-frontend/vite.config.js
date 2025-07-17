import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import eslint from 'vite-plugin-eslint'

export default defineConfig({
   plugins: [react(), eslint()],
   server: {
      proxy: {
         '/auth': {
            target: 'http://localhost:3000',
            changeOrigin: true,
            secure: false,
         },
      },
   },
})
