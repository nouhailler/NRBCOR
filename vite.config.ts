import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, type Plugin} from 'vite';

const APP_VERSION = process.env.npm_package_version || '1.2.0';

/**
 * Génère dist/version.json à chaque build (lu par updateService pour afficher
 * la version déployée et sa date de livraison).
 */
function versionJson(): Plugin {
  return {
    name: 'nrbcor-version-json',
    apply: 'build',
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'version.json',
        source: JSON.stringify(
          {
            version: APP_VERSION,
            buildDate: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }),
            builtAt: new Date().toISOString(),
            commit: (process.env.CF_PAGES_COMMIT_SHA || process.env.GITHUB_SHA || '').slice(0, 7) || undefined,
            swScope: '/',
            integrity: 'verified-offline-corpus',
          },
          null,
          2,
        ),
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), versionJson()],
    define: {
      __APP_VERSION__: JSON.stringify(APP_VERSION),
      __BUILD_DATE__: JSON.stringify(new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })),
    },
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname || '.', '.'),
      },
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(import.meta.dirname || '.', 'index.html'),
          landing: path.resolve(import.meta.dirname || '.', 'landing.html'),
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
