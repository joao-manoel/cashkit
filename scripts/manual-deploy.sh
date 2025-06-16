#!/bin/bash

set -e

echo "📥 Atualizando o repositório (git pull)..."
git pull origin main

echo "📦 Parando apenas o container da API..."
sudo docker compose stop api

echo "🧹 Removendo container da API antigo..."
sudo docker compose rm -f api || true

echo "🛠 Ajustando permissões da pasta de dados para o PostgreSQL (UID 1001)..."
sudo chown -R 1001:1001 ./data/postgres

echo "🔧 Rebuildando a imagem da API..."
sudo docker compose build --no-cache api

echo "🚀 Subindo novamente o container da API..."
sudo docker compose up -d api

echo "✅ Deploy finalizado com sucesso!"
