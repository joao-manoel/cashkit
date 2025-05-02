# Dockerfile para API Node.js/Fastify (@ck/api) em um Turborepo com pnpm (v5 - Prod deps fix)

# ---- Base ----
# Use uma imagem base do Node.js. Ajuste a versão se necessário.
FROM node:20-alpine AS base

# Instale pnpm globalmente
RUN npm install -g pnpm

# ---- Dependências ----
FROM base AS deps
WORKDIR /app

# Copie os arquivos de configuração do root, schema do Prisma (no caminho correto) e código fonte
# Isso permite que o pnpm construa o grafo de dependências corretamente com todo o contexto
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
# Copiando o diretório prisma da API
COPY apps/api/prisma ./apps/api/prisma/
# Descomente se você usa turbo.json
# COPY turbo.json ./
COPY apps ./apps
COPY packages ./packages
COPY config ./config

# Instale todas as dependências do monorepo
# Inclui devDependencies necessárias para build e prisma generate
RUN pnpm install --frozen-lockfile

# Gere o cliente Prisma
# Precisa ser executado após a instalação das dependências
# Usando caminho absoluto para garantir que o schema seja encontrado
RUN pnpm --filter @ck/api exec prisma generate --schema=/app/apps/api/prisma/schema.prisma

# ---- Builder ----
FROM base AS builder
WORKDIR /app

# Copie tudo da etapa de dependências (incluindo node_modules, código fonte e cliente Prisma gerado)
COPY --from=deps /app ./ 

# Defina a variável de ambiente para produção
ENV NODE_ENV=production

# Construa a API específica
# !!! IMPORTANTE: Certifique-se de que o script "build" existe no package.json de @ck/api !!!
# Exemplo usando tsup (que está nas suas devDependencies):
# "scripts": { ... "build": "tsup src/http/server.ts --out-dir dist --format cjs --clean" }
# Ajuste o comando tsup conforme sua estrutura (entry point, output dir, etc.)
RUN pnpm --filter @ck/api build

# ---- Runner ----
FROM node:20-alpine AS runner
WORKDIR /app

# Defina a variável de ambiente para produção
ENV NODE_ENV=production
# Defina a porta padrão (Coolify pode sobrescrever isso)
ENV PORT=3333

# Adicione o diretório global de binários do Node ao PATH (para pnpm)
ENV PATH="/usr/local/lib/node_modules/.bin:${PATH}"

# Copie os arquivos de configuração do pnpm e package.json (root e API)
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json
# Copie outros arquivos de configuração necessários se pnpm install --prod precisar deles
# COPY --from=builder /app/tsconfig.base.json ./tsconfig.base.json # Exemplo

# Instale APENAS as dependências de produção diretamente na imagem final
# Isso evita problemas com symlinks copiados e garante que todos os módulos necessários estejam presentes
RUN pnpm install --prod --frozen-lockfile

# Copie os artefatos de build e prisma da etapa builder
COPY --from=builder /app/apps/api/dist ./dist 
COPY --from=builder /app/apps/api/prisma ./apps/api/prisma
# Copie outros arquivos necessários em produção, se houver (ex: templates de email)
# COPY --from=builder /app/apps/api/templates ./templates

# Exponha a porta que a API escuta
EXPOSE 3333

# Comando para iniciar a API
# Ajuste o caminho para o entrypoint compilado (ex: dist/server.js)
# Nota: Prisma migrations (pnpm exec prisma migrate deploy) devem ser executadas
#       como um passo separado no seu processo de deploy ANTES de iniciar a aplicação.
#       Coolify pode ter uma opção para "Comando de Migração".
# Nota 2: Este CMD inicia apenas o servidor HTTP. A fila (src/queue/queue.ts)
#         precisaria de um Dockerfile/serviço separado ou ser gerenciada por um
#         process manager como PM2 dentro deste container.
CMD ["node", "dist/server.js"]

