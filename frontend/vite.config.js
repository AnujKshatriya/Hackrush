import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        id: '/',
        name: 'EventHub @ IITGN',
        short_name: 'EventHub',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#2575fc',
        description: 'Your one-stop solution for managing events, clubs, and communities at IITGN.',
        icons: [
          {
            src: '/icons/iithub.jpg',
            sizes: '360x360',
            type: 'image/jpg',
          },
          {
            src: '/icons/logo.webp',
            sizes: '752x564',
            type: 'image/webp',
          },
        ],
        screenshots: [
          {
            src: '/screenshot/short-home.png',
            sizes: '562x901',
            type: 'image/png',
            form_factor: 'narrow',
          },
          {
            src: '/screenshot/wide-home.png',
            sizes: '1916x905',
            type: 'image/png',
            form_factor: 'wide',
          },
        ],
      },
      devOptions: {
        enabled: true, // enables service worker in dev for testing
      },
    }),
  ],
});
