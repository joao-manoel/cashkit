# Etapa base com pnpm
FROM node:20-alpine AS base
WORKDIR /app
RUN npm install -g pnpm

# Etapa de dependências (instalação do monorepo)
FROM base AS deps
WORKDIR /app

# Copia todos os arquivos do monorepo
COPY . .

# Remove frontend para evitar build desnecessário e reduzir tamanho
RUN rm -rf apps/web

# Instala todas as dependências do monorepo (workspace)
RUN pnpm install --frozen-lockfile

# Etapa de build da API
FROM base AS builder
WORKDIR /app
COPY --from=deps /app /app

# Builda apenas o app da API usando filtro de workspace
RUN pnpm --filter @ck/api run build

# Etapa final de execução
FROM node:20-alpine
WORKDIR /app

# Copia apenas o necessário para executar a API
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/package.json ./

ENV NODE_ENV=production
CMD ["node", "dist/server.js"]
