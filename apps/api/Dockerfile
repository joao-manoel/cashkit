# ---- Base ----
    FROM node:20-alpine AS base
    RUN npm install -g pnpm
    
    # ---- Dependencies ----
    FROM base AS deps
    WORKDIR /repo
    
    COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
    COPY apps ./apps
    COPY packages ./packages
    COPY config ./config
    
    RUN pnpm install --frozen-lockfile
    
    WORKDIR /repo/apps/api
    RUN pnpm exec prisma generate --schema=prisma/schema.prisma
    
    # ---- Build ----
    FROM base AS builder
    WORKDIR /repo
    
    COPY --from=deps /repo ./
    ENV NODE_ENV=production
    
    RUN pnpm --filter @ck/api build
    
    # Instala somente as deps da API (na própria pasta)
    WORKDIR /repo/apps/api
    RUN pnpm install --prod
    
    # ---- Runner ----
    FROM node:20-alpine AS runner
    
    # Copia a API como raiz da aplicação
    WORKDIR /app
    ENV NODE_ENV=production
    ENV PORT=3333
    
    # Copia tudo da API já construída
    COPY --from=builder /repo/apps/api ./
    
    # Expõe a porta
    EXPOSE 3333
    
    CMD ["node", "dist/server.js"]
    