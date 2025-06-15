FROM node:20-alpine

WORKDIR /app

# Instala ferramentas globais
RUN npm install -g pnpm tsx typescript

# Copia tudo do monorepo
COPY . .

# Garante que o Prisma schema está presente no local correto
# Certifique-se que apps/api/prisma/schema.prisma existe no host

# Instala dependências do monorepo
RUN pnpm install --frozen-lockfile

# Gera Prisma Client usando o schema no caminho correto
WORKDIR /app/apps/api
RUN pnpm prisma generate

# Volta para root do projeto para buildar com o filtro
WORKDIR /app
RUN pnpm --filter @ck/api build

# Dá permissão ao entrypoint
RUN chmod +x ./apps/api/entrypoint.sh

EXPOSE 9090

CMD ["./apps/api/entrypoint.sh"]
