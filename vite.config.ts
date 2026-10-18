import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { writeFileSync } from 'fs';

// Custom Vite plugin: overwrites dist/_redirects with a safe empty file.
//
// Why: Cloudflare's asset store caches files by content hash. If a previous
// deployment uploaded a _redirects with "/* /index.html 200", that bad rule
// stays cached and causes error 100324 on every redeploy — even after we
// deleted the source file. By writing a NEW _redirects with different content,
// Cloudflare detects the hash change, uploads the replacement, and evicts the
// old bad rule. The file contains no redirect rules, so no loop is triggered.
// SPA routing is handled natively by wrangler.json not_found_handling.
function fixRedirectsPlugin() {
  return {
    name: 'fix-cloudflare-redirects',
    closeBundle() {
      const redirectsPath = resolve(__dirname, 'dist', '_redirects');
      const safeContent = '# SPA routing handled by wrangler.json (not_found_handling: single-page-application)\n# No redirect rules — this file intentionally left empty.\n';
      writeFileSync(redirectsPath, safeContent, 'utf-8');
      console.log('[vite] Wrote safe dist/_redirects (overwrites stale Cloudflare asset cache)');
    },
  };
}

export default defineConfig({
  plugins: [react(), fixRedirectsPlugin()],
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
