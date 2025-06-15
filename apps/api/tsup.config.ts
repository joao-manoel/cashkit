import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/http/server.ts'], // ponto de entrada principal
  format: ['esm'], // gerar ESM (usando "type": "module")
  target: 'node20',
  outDir: 'dist',
  sourcemap: true,
  clean: true,
  minify: true,
  dts: true, // gera .d.ts
  noExternal: ['@ck/env'], // inclui no bundle
})
