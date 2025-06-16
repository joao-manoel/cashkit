#!/bin/bash

set -e

echo "📥 Atualizando o repositório (git pull)..."
git pull origin main

echo "📦 Parando apenas o container da API..."
docker compose stop api

echo "🧹 Removendo container da API antigo..."
docker compose rm -f api

echo "🛠 Corrigindo permissões da pasta de dados do PostgreSQL..."
sudo chown -R $USER:$USER ./data/postgres
chmod -R 755 ./data/postgres

echo "🔧 Rebuildando a imagem da API..."
docker compose build --no-cache api

echo "🚀 Subindo novamente o container da API..."
docker compose up -d api

echo "✅ Deploy finalizado com sucesso!"
