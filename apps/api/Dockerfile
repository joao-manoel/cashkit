# ---- Base ----
    FROM node:20-alpine AS base

    # Instala pnpm globalmente
    RUN npm install -g pnpm
    
    # ---- Dependências ----
    FROM base AS deps
    WORKDIR /app
    
    # Copia arquivos do monorepo
    COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
    COPY apps ./apps
    COPY packages ./packages
    COPY config ./config
    
    # Instala todas as dependências
    RUN pnpm install --frozen-lockfile
    
    # Gera o cliente Prisma da API
    WORKDIR /app/apps/api
    RUN pnpm exec prisma generate --schema=prisma/schema.prisma
    
    # ---- Builder ----
    FROM base AS builder
    WORKDIR /app
    
    # Copia tudo da etapa anterior
    COPY --from=deps /app ./
    
    # Define ambiente de produção
    ENV NODE_ENV=production
    
    # Compila a API
    RUN pnpm --filter @ck/api build
    
    # Instala só as dependências de produção da API
    WORKDIR /app/apps/api
    RUN pnpm install --prod
    
    # ---- Runner ----
    FROM node:20-alpine AS runner
    WORKDIR /app
    
    ENV NODE_ENV=production
    ENV PORT=3333
    ENV PATH="/usr/local/lib/node_modules/.bin:${PATH}"
    
    # Copia a API inteira (com dist, node_modules, prisma e package.json)
    COPY --from=builder /app/apps/api ./ 
    
    # Expõe a porta padrão da API
    EXPOSE 3333
    
    # Inicia o servidor
    CMD ["node", "dist/server.js"]
    