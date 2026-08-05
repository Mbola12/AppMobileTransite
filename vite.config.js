import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    plugins: [
        vue(),
        VitePWA({
            registerType: 'autoUpdate',
            injectRegister: 'auto',
            includeAssets: ['favicon-32x32.png', 'apple-touch-icon.png'],
            manifest: {
                name: 'transMaki',
                short_name: 'transMaki',
                description: 'Application de suivi de dossiers et navires transMaki',
                start_url: '/clientacces/',
                scope: '/clientacces/',
                display: 'standalone',
                background_color: '#ffffff',
                theme_color: '#808080',
                icons: [
                    {
                        src: 'img/pwa-192x192.png',
                        sizes: '192x192',
                        type: 'image/png',
                    },
                    {
                        src: 'img/pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                    },
                    {
                        src: 'img/pwa-maskable-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'maskable',
                    },
                ],
            },
            workbox: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}'],
                maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
            },
        }),
    ],
    base: '/public-client/', // Base URL des assets

    build: {
        sourcemap: true,
        assetsDir: 'assets', // Met les fichiers dans public-client/assets
        outDir: 'C:/laragon/www/MA_TRANSIT/public-client', // Dossier où seront stockés JS/CSS
        emptyOutDir: true, // Nettoie `public-client` avant chaque build
        rollupOptions: {
            input: {
                main: path.resolve(__dirname, 'src/main.js'), // Fichier JS d'entrée
            },
            output: {
                entryFileNames: 'assets/[name]-[hash].js',
                chunkFileNames: 'assets/[name]-[hash].js',
                assetFileNames: 'assets/[name]-[hash].[ext]',
            },
        },
    },

    // server: {
    //     port: 3000,
    //     proxy: {
    //         '/api': {
    //             target: 'http://localhost/ma_transit/',
    //             changeOrigin: true,
    //             rewrite: (path) => path.replace(/^\/api/, ''),
    //         },
    //     },
    // },

    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
});
