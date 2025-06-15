FROM node:20-alpine

WORKDIR /app

# Instala ferramentas globais
RUN npm install -g pnpm tsx typescript

# Copia tudo do monorepo
COPY . .

# Instala as dependências do monorepo
RUN pnpm install --frozen-lockfile

# Gera Prisma Client
RUN pnpm --filter @ck/api prisma generate

# Compila o projeto
RUN pnpm --filter @ck/api build

# Copia e dá permissão ao entrypoint
RUN chmod +x ./apps/api/entrypoint.sh

EXPOSE 9090

CMD ["./apps/api/entrypoint.sh"]
