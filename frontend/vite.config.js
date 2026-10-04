import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const API_SERVER = 'http://localhost:3003';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // the server allows this address, so the port must not drift
    port: 5177,
    strictPort: true,
    // one address for the browser: the web app forwards /api to the server
    proxy: {
      '/api': API_SERVER,
    },
  },
});
