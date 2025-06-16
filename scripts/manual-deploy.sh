#!/bin/bash

set -e

echo "📥 Atualizando o repositório (git pull)..."
git pull origin main

echo "📦 Parando apenas o container da API..."
sudo docker compose stop api

echo "🧹 Removendo container da API antigo..."
sudo docker compose rm -f api || true

echo "🛠 Corrigindo permissões da pasta de dados do PostgreSQL..."
sudo chown -R $USER:$USER ./data/postgres
sudo chmod -R 755 ./data/postgres

echo "🔧 Rebuildando a imagem da API..."
sudo docker compose build --no-cache api

echo "🚀 Subindo novamente o container da API..."
sudo docker compose up -d api

echo "✅ Deploy finalizado com sucesso!"
