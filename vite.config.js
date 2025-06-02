import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import path from 'path';
import history from 'connect-history-api-fallback';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

export default defineConfig({
  plugins: [
    react(),
    vanillaExtractPlugin(),
    {
      name: 'html-fallback-middleware',
      configureServer(server) {
        server.middlewares.use(
          history({
            verbose: false,
            disableDotRule: false,
            htmlAcceptHeaders: ['text/html'],
          })
        );
      },
    },
  ],
  resolve: {
    alias: {
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@canvas': path.resolve(__dirname, 'src/canvas'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@localization': path.resolve(__dirname, 'localization'),
      '@styles': path.resolve(__dirname, 'src/styles'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@': path.resolve(__dirname, './src'),
      '@core': path.resolve(__dirname, './src/canvas/core'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@store': path.resolve(__dirname, 'src/store'),
      '@auth': path.resolve(__dirname, 'src/auth'),
      '@api': path.resolve(__dirname, 'src/api'),
      '@lib': path.resolve(__dirname, 'lib'),
      '@designer': path.resolve(__dirname, 'dashboard/designer'),
    },
    extensions: ['.js', '.jsx'],
  },
  optimizeDeps: {
    include: [
      'three',
      'three-mesh-bvh',
      'three-bvh-csg',
    ],
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    open: true,
    fs: {
      strict: false,
    },
    proxy: {
      // ✅ This forwards all /api requests to backend
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
