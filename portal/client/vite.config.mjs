import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import autoprefixer from 'autoprefixer'

export default defineConfig(() => {
  return {
    base: './',
    build: {
      outDir: 'build',
    },
    logLevel: 'info',
    css: {
      postcss: {
        plugins: [
          autoprefixer({}), // Autoprefixer for CSS compatibility
        ],
      },
      preprocessorOptions: {
        scss: {
          quietDeps: true,
        },
      },
    },
    esbuild: {
      loader: 'jsx',
      include: /src\/.*\.jsx?$/,
      exclude: [],
    },
    optimizeDeps: {
      force: true,
      esbuildOptions: {
        loader: {
          '.js': 'jsx',
        },
      },
    },
    plugins: [
      react(),
      // mkcert(), // Remove mkcert if not using locally trusted certificates
    ],
    resolve: {
      alias: [
        {
          find: 'src/',
          replacement: `${path.resolve(__dirname, 'src')}/`,
        },
      ],
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.scss'],
    },
    server: {
      host: true,
      port: 3000,
      proxy: {
        '/api': {
          target: 'http://localhost:5005',
          changeOrigin: false,
          secure: false, // Use true for production; false can be used in development if the backend SSL is self-signed
          rewrite: (path) => path.replace(/^\/api/, '/api'),
        },
      },
    },
  }
})
