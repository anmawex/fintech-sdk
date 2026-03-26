import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'FintechPayment',
      fileName: 'fintech-payment',
      formats: ['es', 'umd']
    },
    rollupOptions: {
      // No externalize dependencies as the goal is a single file for easy integration
      output: {
        manualChunks: undefined,
        entryFileNames: `[name].min.js`, // Name of the final minified file
        inlineDynamicImports: true
      }
    },
    minify: 'terser', // Ensure it's minified
    sourcemap: false
  }
});
