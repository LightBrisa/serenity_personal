import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/postcss';
import path from 'node:path';
import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig({
  root: path.resolve(import.meta.dirname, 'demo'),
  base: './',
  css: { postcss: { plugins: [tailwindcss()] } },
  plugins: [react(), viteSingleFile()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname),
    },
  },
  build: {
    modulePreload: false,
    outDir: path.resolve(import.meta.dirname, 'work', 'demo-build'),
    emptyOutDir: true,
    assetsInlineLimit: Number.MAX_SAFE_INTEGER,
    cssCodeSplit: false,
    rollupOptions: {
      output: { inlineDynamicImports: true },
    },
  },
});
