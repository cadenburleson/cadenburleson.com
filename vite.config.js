import { defineConfig } from 'vite';

export default defineConfig({
    // Base path for development and production
    base: '/',

    // Development server configurations
    server: {
        port: 5173,
        open: true,
        host: true,
        strictPort: true,
    },

    // Build configurations
    build: {
        outDir: 'dist',
        sourcemap: true,
    },
});
