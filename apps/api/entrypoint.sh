#!/bin/sh

echo "⏳ Aguardando banco de dados..."
until nc -z pg 5432; do
  sleep 1
done

echo "✅ Banco disponível. Aplicando migrações Prisma..."
pnpm --filter @ck/api exec prisma migrate deploy

echo "🚀 Iniciando aplicação..."
pnpm --filter @ck/api exec concurrently \
  "node dist/http/server.js" \
  "node dist/queue/queue.js"
