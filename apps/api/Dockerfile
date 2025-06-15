FROM node:20-alpine

WORKDIR /app

# Instala pnpm e tsx
RUN npm install -g pnpm tsx

# Copia arquivos do monorepo
COPY ../../package.json ../../pnpm-lock.yaml ../../turbo.json ./
COPY ../../config ./config
COPY ../../packages ./packages
COPY ../../apps/api ./apps/api

# Instala dependências
RUN pnpm install --frozen-lockfile

# Gera Prisma Client
RUN pnpm --filter ./apps/api prisma generate

# Compila a API com tsconfig.build.json
RUN pnpm --filter ./apps/api build

# Copia entrypoint que vai rodar migrate e start
COPY apps/api/entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

EXPOSE 9090

CMD ["./entrypoint.sh"]
