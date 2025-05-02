# Etapa 1: build do monorepo
FROM node:20 AS builder

RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

WORKDIR /app
COPY . .

# Define args (opcional, se estiver usando ENV no build)
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

# Etapa 2: imagem enxuta para produção
FROM node:20-alpine AS runner

RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

WORKDIR /app

# Copia o app web e dependências locais
COPY --from=builder /app/apps/web ./
COPY --from=builder /app/apps/web/node_modules ./node_modules
COPY --from=builder /app/apps/web/.next ./.next
COPY --from=builder /app/apps/web/public ./public

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# Usa npx pois o "next" está nos node_modules locais
CMD ["pnpm", "start"]
