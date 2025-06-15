#!/bin/bash

echo "📥 Atualizando o repositório (git pull)..."
git pull origin main

echo "📦 Parando apenas o container da API..."
docker compose stop cashkit-api

echo "🧹 Removendo container da API antigo..."
docker compose rm -f cashkit-api

echo "🔧 Rebuildando a imagem da API..."
docker compose build --no-cache cashkit-api

echo "🚀 Subindo novamente o container da API..."
docker compose up -d cashkit-api

echo "✅ Deploy finalizado com sucesso!"
