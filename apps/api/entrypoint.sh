#!/bin/sh

echo "⏳ Aguardando banco de dados (pg:5432)..."
until nc -z pg 5432; do
  echo "❌ Banco ainda indisponível, aguardando..."
  sleep 1
done

echo "✅ Banco disponível. Aplicando migrações Prisma..."
pnpm --filter @ck/api exec prisma migrate deploy

echo "🚀 Iniciando aplicação..."
pnpm --filter @ck/api exec node dist/server.mjs
