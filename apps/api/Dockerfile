# ---- Base ----
    FROM node:20-alpine AS base

    # Instale pnpm globalmente
    RUN npm install -g pnpm
    
    # ---- Dependências ----
    FROM base AS deps
    WORKDIR /app
    
    # Copie arquivos do monorepo
    COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
    COPY apps ./apps
    COPY packages ./packages
    COPY config ./config
    
    # Instale dependências completas (inclui dev para prisma generate)
    RUN pnpm install --frozen-lockfile
    
    # Gere o cliente Prisma da API no caminho correto
    WORKDIR /app/apps/api
    RUN pnpm exec prisma generate --schema=prisma/schema.prisma
    
    # Volte ao root para etapa builder
    WORKDIR /app
    
    # ---- Builder ----
    FROM base AS builder
    WORKDIR /app
    
    # Copie dependências e código
    COPY --from=deps /app ./
    
    # Variável de ambiente para build otimizado
    ENV NODE_ENV=production
    
    # Compile a API
    RUN pnpm --filter @ck/api build
    
    # Instale apenas dependências de produção da API
    RUN pnpm --filter @ck/api install --prod
    
    # ---- Runner ----
    FROM node:20-alpine AS runner
    WORKDIR /app
    
    ENV NODE_ENV=production
    ENV PORT=3333
    ENV PATH="/usr/local/lib/node_modules/.bin:${PATH}"
    
    # Copie artefatos da build
    COPY --from=builder /app/apps/api/dist ./dist
    COPY --from=builder /app/apps/api/prisma ./apps/api/prisma
    COPY --from=builder /app/apps/api/package.json ./apps/api/package.json
    COPY --from=builder /app/node_modules ./node_modules
    
    # Exponha a porta padrão
    EXPOSE 3333
    
    # Inicie a aplicação
    CMD ["node", "dist/server.js"]
    