import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        proxy: {
            '/process_query': 'http://127.0.0.1:5002',
            '/detect_hallucination': 'http://127.0.0.1:5002',
            '/get_live_events': 'http://127.0.0.1:5002'
        }
    }
})
