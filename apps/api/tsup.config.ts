import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/http/server.ts'],
  format: ['esm'],
  target: 'node20',
  outDir: 'dist',
  sourcemap: true,
  clean: true,
  minify: true,
  dts: true,
  noExternal: ['@ck/env'],
})
