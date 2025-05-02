# ---- Base ----
    FROM node:20-alpine AS base
    RUN npm install -g pnpm
    
    # ---- Dependências ----
    FROM base AS deps
    WORKDIR /app
    
    COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
    COPY apps ./apps
    COPY packages ./packages
    COPY config ./config
    
    ENV PNPM_NODE_LINKER=hoisted
    RUN pnpm install --frozen-lockfile
    
    # ---- Builder ----
    FROM base AS builder
    WORKDIR /app
    
    COPY --from=deps /app ./
    
    ENV NODE_ENV=production
    
    # Build da API
    RUN pnpm --filter @ck/api build
    
    # Gera Prisma Client corretamente (caminho relativo à raiz da API)
    WORKDIR /app/apps/api
    RUN pnpm exec prisma generate --schema=prisma/schema.prisma
    
    # Instala dependências de produção da API (com arquivos físicos)
    RUN pnpm install --prod
    
    # ---- Runner ----
    FROM node:20-alpine AS runner
    WORKDIR /app
    
    ENV NODE_ENV=production
    ENV PORT=3333
    
    COPY --from=builder /app/apps/api/dist ./dist
    COPY --from=builder /app/apps/api/prisma ./prisma
    COPY --from=builder /app/apps/api/package.json ./package.json
    COPY --from=builder /app/apps/api/node_modules ./node_modules
    
    EXPOSE 3333
    
    CMD ["node", "dist/server.js"]
    