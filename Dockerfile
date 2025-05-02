# Etapa 1: build do monorepo
FROM node:20 AS builder

RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

WORKDIR /app
COPY . .

# Variáveis de ambiente opcionais
ARG NEXT_PUBLIC_API_URL
ARG JWT_SECRET
ARG GOOGLE_OAUTH_CLIENT_SECRET
ARG GOOGLE_OAUTH_CLIENT_ID
ARG GOOGLE_OAUTH_REDIRECT_URI
ARG NODEMAILER_USER
ARG NODEMAILER_PASSWORD
ARG REDIS_HOST
ARG REDIS_PORT
ARG PORT

RUN pnpm install
RUN pnpm turbo run build --filter=@ck/web...

# Etapa 2: imagem enxuta de produção
FROM node:20-alpine AS runner

RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

WORKDIR /app

# Copia arquivos necessários
COPY --from=builder /app/apps/web ./
COPY --from=builder /app/apps/web/.next ./.next
COPY --from=builder /app/apps/web/public ./public
COPY --from=builder /app/apps/web/package.json ./package.json

# Copia node_modules da raiz (onde o next está de fato)
COPY --from=builder /app/node_modules ./node_modules

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000
CMD ["pnpm", "start"]
