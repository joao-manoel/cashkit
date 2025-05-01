# Etapa 1: build do monorepo
FROM node:20 AS builder

# Habilita o pnpm via corepack
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

WORKDIR /app

# Copia os arquivos do projeto
COPY . .

# Define os argumentos de build que virão do Coolify
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

# Exporta os argumentos como variáveis de ambiente
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV JWT_SECRET=$JWT_SECRET
ENV GOOGLE_OAUTH_CLIENT_SECRET=$GOOGLE_OAUTH_CLIENT_SECRET
ENV GOOGLE_OAUTH_CLIENT_ID=$GOOGLE_OAUTH_CLIENT_ID
ENV GOOGLE_OAUTH_REDIRECT_URI=$GOOGLE_OAUTH_REDIRECT_URI
ENV NODEMAILER_USER=$NODEMAILER_USER
ENV NODEMAILER_PASSWORD=$NODEMAILER_PASSWORD
ENV REDIS_HOST=$REDIS_HOST
ENV REDIS_PORT=$REDIS_PORT
ENV PORT=$PORT

# Instala dependências do monorepo
RUN pnpm install

# Builda apenas o app web
RUN pnpm turbo run build --filter=@ck/web...

# Etapa 2: imagem enxuta de produção
FROM node:20-alpine AS runner

RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

WORKDIR /app

# Copia apenas o necessário para rodar o app web
COPY --from=builder /app/apps/web/.next .next
COPY --from=builder /app/apps/web/public public
COPY --from=builder /app/apps/web/package.json .
COPY --from=builder /app/node_modules node_modules

# Copia o .env de produção, se você tiver um
COPY .env.production .env

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["pnpm", "start"]
