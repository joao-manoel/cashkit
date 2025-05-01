# Etapa 1: build do monorepo
FROM node:20 AS builder

RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

WORKDIR /app

# Copia todos os arquivos do projeto, incluindo o .env
COPY . .

# ⬅️ COPIA explícita se quiser garantir:
# COPY .env.production .env

# Instala dependências do monorepo
RUN pnpm install

# ⚠️ Garante que o .env esteja disponível no build
ENV NODE_ENV=production
ENV DOTENV_CONFIG_PATH=.env

# Builda apenas o app web
RUN pnpm turbo run build --filter=@ck/web...

# Etapa 2: imagem enxuta de produção
FROM node:20-alpine AS runner

RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

WORKDIR /app

COPY .env.production .env

# Copia só os arquivos da app web
COPY --from=builder /app/apps/web/.next .next
COPY --from=builder /app/apps/web/public public
COPY --from=builder /app/apps/web/package.json .
COPY --from=builder /app/node_modules node_modules

ENV PORT=3000

EXPOSE 3000

CMD ["pnpm", "start"]
