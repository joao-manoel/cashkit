# Etapa 1: Instala dependências e compila a aplicação
FROM node:18-alpine AS builder

# Instala pnpm
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

# Cria diretório de trabalho
WORKDIR /app

# Copia os arquivos necessários para instalação das dependências
COPY .gitignore .npmrc pnpm-workspace.yaml turbo.json ./
COPY package.json pnpm-lock.yaml ./
COPY apps/web/package.json apps/web/
COPY packages ./packages
COPY apps/web ./apps/web

# Instala dependências
RUN pnpm install --frozen-lockfile

# Compila a aplicação Next.js
RUN pnpm --filter @ck/web... build

# Etapa 2: Imagem final somente com os arquivos necessários
FROM node:18-alpine AS runner

# Instala pnpm novamente
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

# Define diretório de trabalho
WORKDIR /app

# Copia o output da aplicação compilada
COPY --from=builder /app/apps/web/.next ./.next
COPY --from=builder /app/apps/web/public ./public
COPY --from=builder /app/apps/web/next.config.js ./
COPY --from=builder /app/apps/web/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

# Expõe a porta 3000
EXPOSE 3000

# Comando para iniciar o app
CMD ["pnpm", "start"]
