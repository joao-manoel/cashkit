# apps/api/Dockerfile

FROM node:20-alpine

WORKDIR /app

# Instala pnpm, tsx e typescript globalmente
RUN npm install -g pnpm tsx typescript

# Copia arquivos de configuração do monorepo
COPY package.json pnpm-lock.yaml turbo.json ./

# Copia pacotes compartilhados e configs
COPY packages ./packages
COPY config ./config

# Copia o código da API
COPY apps/api ./apps/api

# Instala dependências (respeitando workspaces)
RUN pnpm install --frozen-lockfile

# Gera Prisma Client
RUN pnpm --filter @ck/api... prisma generate

# Compila TypeScript
RUN pnpm --filter @ck/api... build

# Copia entrypoint
COPY apps/api/entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

EXPOSE 9090

CMD ["./entrypoint.sh"]
