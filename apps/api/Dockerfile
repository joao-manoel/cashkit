FROM node:20-alpine

# Define diretório de trabalho
WORKDIR /app

# Instala dependências globais
RUN npm install -g pnpm typescript tsx tsc-alias

# Copia o monorepo inteiro
COPY . .

# Instala dependências
RUN pnpm install --frozen-lockfile

# Garante que o Prisma schema esteja visível
WORKDIR /app/apps/api
RUN pnpm prisma generate

# Compila e ajusta os paths dos aliases
RUN pnpm build

# Dá permissão ao script de entrada
RUN chmod +x ./entrypoint.sh

# Porta exposta
EXPOSE 9090

CMD ["./entrypoint.sh"]
