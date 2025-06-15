import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/http/server.ts'],
  format: ['esm'],
  target: 'node16',
  outDir: 'dist',
  sourcemap: true,
  clean: true,
  minify: true,
  dts: false,
  noExternal: ['@ck/env'],
})
