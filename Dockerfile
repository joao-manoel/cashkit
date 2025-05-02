# Dockerfile para aplicação Next.js (@ck/web) em um Turborepo com pnpm (v3 - sem standalone)

# ---- Base ----
# Use uma imagem base do Node.js. Ajuste a versão se necessário.
FROM node:20-alpine AS base

# Instale pnpm globalmente
RUN npm install -g pnpm

# ---- Dependências ----
FROM base AS deps
WORKDIR /app

# Copie os arquivos de configuração do root e o código fonte
# Isso permite que o pnpm construa o grafo de dependências corretamente com todo o contexto
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./ 
# Descomente se você usa turbo.json
# COPY turbo.json ./
COPY apps ./apps
COPY packages ./packages
COPY config ./config

# Instale todas as dependências do monorepo
# O pnpm irá baixar apenas as dependências necessárias para o build posteriormente
RUN pnpm install --frozen-lockfile

# ---- Builder ----
FROM base AS builder
WORKDIR /app

# Copie tudo da etapa de dependências (incluindo node_modules e código fonte)
COPY --from=deps /app ./ 

# Defina a variável de ambiente para produção
ENV NODE_ENV=production

# Construa a aplicação web específica
# Use o nome do pacote definido no package.json da aplicação web (@ck/web)
RUN pnpm --filter @ck/web build

# ---- Runner ----
FROM node:20-alpine AS runner
WORKDIR /app

# Defina a variável de ambiente para produção
ENV NODE_ENV=production
# Defina a porta padrão do Next.js (Coolify pode sobrescrever isso)
ENV PORT=3000

# Copie os artefatos necessários da etapa builder para a execução sem standalone
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/web ./apps/web
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/config ./config
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
# Descomente se você usa turbo.json
# COPY --from=builder /app/turbo.json ./

# Exponha a porta
EXPOSE 3000

# Comando para iniciar a aplicação usando pnpm
CMD ["pnpm", "--filter", "@ck/web", "start"]

