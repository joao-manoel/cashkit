FROM node:20-alpine

WORKDIR /app

# Instala pnpm, tsx e typescript
RUN npm install -g pnpm tsx typescript

# Copia arquivos base do monorepo
COPY package.json pnpm-lock.yaml turbo.json ./

# Copia pacotes compartilhados
COPY packages ./packages

# Copia configurações compartilhadas (eslint, prettier, tsconfig, etc)
COPY config ./config

# Copia a pasta turbo (necessário se você usa cache entre builds, tarefas etc)
COPY .turbo ./.turbo

# Copia a API
COPY apps/api ./apps/api

# Instala dependências (respeitando workspaces)
RUN pnpm install --frozen-lockfile

# Gera Prisma Client
RUN pnpm --filter @ck/api prisma generate

# Compila o projeto
RUN pnpm --filter @ck/api build

# Copia entrypoint
COPY apps/api/entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

EXPOSE 9090

CMD ["./entrypoint.sh"]
