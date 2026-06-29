import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        proxy: {
            '/api': {
                target: 'http://localhost:5002',
                changeOrigin: true,
                secure: false,
            },
            '/process_query': {
                target: 'http://localhost:5002',
                changeOrigin: true
            },
            '/detect_hallucination': {
                target: 'http://127.0.0.1:5002',
                changeOrigin: true
            },
            '/get_live_events': {
                target: 'http://127.0.0.1:5002',
                changeOrigin: true
            }
        }
    }
})
