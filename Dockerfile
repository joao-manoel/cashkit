# Etapa 1: Build do monorepo
FROM node:20 AS builder

RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

WORKDIR /app
COPY . .


RUN pnpm install
RUN pnpm turbo run build --filter=@ck/web...

# Etapa 2: Produção
FROM node:20-alpine AS runner

RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

WORKDIR /app

# Copia build e dependências necessárias
COPY --from=builder /app/apps/web ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/web/.next ./.next
COPY --from=builder /app/apps/web/public ./public

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["npx", "next", "start"]
