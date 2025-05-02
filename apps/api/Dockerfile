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
    
    RUN pnpm install --frozen-lockfile
    
    WORKDIR /app/apps/api
    RUN pnpm exec prisma generate --schema=prisma/schema.prisma
    
    WORKDIR /app
    
    # ---- Builder ----
    FROM base AS builder
    WORKDIR /app
    
    COPY --from=deps /app ./
    
    ENV NODE_ENV=production
    
    RUN pnpm --filter @ck/api build
    
    # Instale somente as deps da API (na própria pasta dela)
    WORKDIR /app/apps/api
    RUN pnpm install --prod
    
    # ---- Runner ----
    FROM node:20-alpine AS runner
    WORKDIR /app
    
    ENV NODE_ENV=production
    ENV PORT=3333
    ENV PATH="/usr/local/lib/node_modules/.bin:${PATH}"
    
    # Copie dist e schema da API
    COPY --from=builder /app/apps/api/dist ./dist
    COPY --from=builder /app/apps/api/prisma ./apps/api/prisma
    COPY --from=builder /app/apps/api/package.json ./apps/api/package.json
    
    # Copie SOMENTE os node_modules da API
    COPY --from=builder /app/apps/api/node_modules ./node_modules
    
    EXPOSE 3333
    
    CMD ["node", "dist/server.js"]
    