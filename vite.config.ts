import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { existsSync, unlinkSync } from 'fs';

// Custom Vite plugin: removes _redirects from dist after every build.
// Cloudflare Workers + not_found_handling:"single-page-application" handles
// SPA routing natively; a _redirects catch-all causes error code 100324.
function removeRedirectsPlugin() {
  return {
    name: 'remove-cloudflare-redirects',
    closeBundle() {
      const redirectsPath = resolve(__dirname, 'dist', '_redirects');
      if (existsSync(redirectsPath)) {
        unlinkSync(redirectsPath);
        console.log('[vite] Removed dist/_redirects (handled by wrangler.json)');
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), removeRedirectsPlugin()],
  server: {
    port: 3000,
  },
  build: {
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          supabase: ['@supabase/supabase-js'],
          icons: ['lucide-react'],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
});
