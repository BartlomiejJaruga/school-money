import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://bit-fix.online/api',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('Origin', 'https://bit-fix.online');
          });
        },
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, 'src/components'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@styles': path.resolve(__dirname, 'src/styles'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@routes': path.resolve(__dirname, 'src/routes'),
      '@lib': path.resolve(__dirname, 'src/lib'),
      '@schemas': path.resolve(__dirname, 'src/schemas'),
      '@dtos': path.resolve(__dirname, 'scr/services/dtos'),
      '@services': path.resolve(__dirname, 'src/services'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "@styles/_variables" as *;
          @use "@styles/_mixins" as *;
        `,
      },
    },
  },
});
