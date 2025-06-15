#!/bin/sh

echo "⏳ Aguardando banco de dados..."
until nc -z pg 5432; do
  sleep 1
done

echo "✅ Banco disponível. Rodando prisma migrate deploy..."
pnpm --filter @ck/api prisma migrate deploy

echo "🚀 Iniciando aplicação..."
pnpm --filter @ck/api start
