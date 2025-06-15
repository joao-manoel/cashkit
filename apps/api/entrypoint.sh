#!/bin/sh

set -e

echo "⏳ Aguardando banco de dados..."
until nc -z pg 5432; do
  sleep 1
done

echo "✅ Banco disponível. Rodando prisma migrate deploy..."
cd apps/api
npx prisma migrate deploy

echo "🚀 Iniciando aplicação..."
pnpm start
