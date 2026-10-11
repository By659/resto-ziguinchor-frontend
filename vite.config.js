import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // Mode offline partiel exigé par le cahier des charges :
      // met en cache les fichiers statiques (HTML/JS/CSS) pour un accès hors-ligne basique.
      // Les données dynamiques (menu, commandes) ne sont pas mises en cache ici (TODO si besoin).
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
      },
      manifest: {
        name: 'Plateforme de commande - Ziguinchor',
        short_name: 'RestoZig',
        description: 'Commande en ligne pour restaurants de Ziguinchor',
        theme_color: '#c9694f',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
    }),
  ],
});
