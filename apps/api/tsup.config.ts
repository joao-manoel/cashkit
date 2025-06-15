import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    'http/server': 'src/http/server.ts',
    'queue/queue': 'src/queue/queue.ts',
  },
  format: ['esm'],
  target: 'node20',
  outDir: 'dist',
  sourcemap: true,
  clean: true,
  minify: true,
  dts: false,
  noExternal: ['@ck/env'],
})
