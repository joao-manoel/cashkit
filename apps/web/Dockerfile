# Dockerfile

FROM node:20

# Ativa o Corepack para instalar o pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Cria diretório de trabalho
WORKDIR /app

# Copia os arquivos da aplicação
COPY . .

# Instala dependências
RUN pnpm install

# Faz o build da aplicação
RUN pnpm build

# Expõe a porta
EXPOSE 3000

# Comando de start (altere conforme seu framework)
CMD ["pnpm", "start"]
