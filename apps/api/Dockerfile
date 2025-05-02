# ---- Base ----
    FROM node:20-alpine AS base

    # Instale o pnpm globalmente
    RUN npm install -g pnpm
    
    # ---- Dependências ----
    FROM base AS deps
    WORKDIR /app
    
    # Copie os arquivos essenciais do monorepo
    COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
    COPY apps ./apps
    COPY packages ./packages
    COPY config ./config
    
    # Instale todas as dependências do monorepo
    RUN pnpm install --frozen-lockfile
    
    # Gere o cliente Prisma da API (usando schema correto)
    RUN pnpm --filter @ck/api exec prisma generate --schema=apps/api/prisma/schema.prisma
    
    # ---- Builder ----
    FROM base AS builder
    WORKDIR /app
    
    # Copie o projeto e dependências
    COPY --from=deps /app ./
    
    # Garanta que a API tenha build disponível
    ENV NODE_ENV=production
    
    # Compile a API
    RUN pnpm --filter @ck/api build
    
    # Instale SOMENTE as dependências de produção da API
    RUN pnpm --filter @ck/api install --prod
    
    # ---- Runner ----
    FROM node:20-alpine AS runner
    WORKDIR /app
    
    ENV NODE_ENV=production
    ENV PORT=3333
    ENV PATH="/usr/local/lib/node_modules/.bin:${PATH}"
    
    # Copie apenas o necessário da API
    COPY --from=builder /app/apps/api/dist ./dist
    COPY --from=builder /app/apps/api/prisma ./apps/api/prisma
    COPY --from=builder /app/apps/api/package.json ./apps/api/package.json
    COPY --from=builder /app/node_modules ./node_modules
    
    EXPOSE 3333
    
    CMD ["node", "dist/server.js"]
    