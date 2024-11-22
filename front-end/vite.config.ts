import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: './cert/localhost-key.pem',
      cert: './cert/localhost.pem',
    },
    /* proxy: {
      "/api": {
        target: "https://localhost:3000"
      },
    }, */
    
  },
})
