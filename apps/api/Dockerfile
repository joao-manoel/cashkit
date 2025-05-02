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
    
    # Prisma generate
    WORKDIR /repo/apps/api
    RUN pnpm exec prisma generate --schema=prisma/schema.prisma
    
    # ---- Build ----
    FROM base AS builder
    WORKDIR /repo
    
    COPY --from=deps /repo ./
    
    ENV NODE_ENV=production
    
    # Build API
    RUN pnpm --filter @ck/api build
    
    # Install production deps only for API
    WORKDIR /repo/apps/api
    RUN pnpm install --prod
    
    # ---- Runtime ----
    FROM node:20-alpine AS runner
    
    # API será o root da app final
    WORKDIR /app
    
    ENV NODE_ENV=production
    ENV PORT=3333
    
    # Copia apenas a API completa com deps, prisma e dist
    COPY --from=builder /repo/apps/api ./
    
    EXPOSE 3333
    
    CMD ["node", "dist/server.js"]
    