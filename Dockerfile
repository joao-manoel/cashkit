# Etapa 1: build do monorepo
FROM node:20 AS builder

# Habilita o pnpm via corepack
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

WORKDIR /app

# Copia os arquivos do projeto atualizado
COPY . .

# Instala dependências do monorepo
RUN pnpm install

# Builda apenas o app web
RUN pnpm turbo run build --filter=@ck/web...

# Etapa 2: imagem enxuta de produção
FROM node:20-alpine AS runner

RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

WORKDIR /app

# Copia apenas o necessário para rodar o app web
COPY --from=builder /app/apps/web ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/web/node_modules ./node_modules
COPY --from=builder /app/apps/web/package.json ./
COPY .env.production .env

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["pnpm", "start"]
