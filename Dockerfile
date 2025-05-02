# Dockerfile para aplicação Next.js (@ck/web) em um Turborepo com pnpm

# ---- Base ----
# Use uma imagem base do Node.js. Ajuste a versão se necessário.
FROM node:20-alpine AS base

# Instale pnpm globalmente
RUN npm install -g pnpm

# ---- Dependências ----
FROM base AS deps
WORKDIR /app

# Copie os arquivos de configuração do root
# Inclua turbo.json se você o utiliza
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./ 
# COPY turbo.json ./

# Instale todas as dependências do monorepo
# Isso é necessário para que o pnpm possa construir o grafo de dependências corretamente
# O pnpm irá baixar apenas as dependências necessárias para o build posteriormente
RUN pnpm install --frozen-lockfile

# ---- Builder ----
FROM base AS builder
WORKDIR /app

# Copie as dependências instaladas da etapa anterior
COPY --from=deps /app/node_modules ./node_modules
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./ 
# COPY turbo.json ./

# Copie o código fonte das aplicações e pacotes
# Copie a aplicação 'web' e quaisquer pacotes dos quais ela dependa
COPY apps/web ./apps/web
COPY packages ./packages
COPY config ./config

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
# Defina a porta padrão do Next.js
ENV PORT=3000

# Copie os artefatos da build da etapa builder
# Next.js com output 'standalone' (recomendado) cria uma pasta standalone
# Verifique se 'output: "standalone"' está configurado em apps/web/next.config.js
COPY --from=builder /app/apps/web/.next/standalone ./ 
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder /app/apps/web/public ./apps/web/public

# Exponha a porta
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["node", "apps/web/server.js"]

# --- Alternativa sem standalone (menos otimizado) ---
# Se você não estiver usando 'output: "standalone"', comente as linhas COPY acima e descomente as abaixo:
# COPY --from=builder /app/node_modules ./node_modules
# COPY --from=builder /app/apps/web ./apps/web
# COPY --from=builder /app/package.json ./
# CMD ["pnpm", "--filter", "@ck/web", "start"]
