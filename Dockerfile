# Dockerfile para aplicação Next.js (@ck/web) em um Turborepo com pnpm (v2)

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
# Usar --prod aqui pode quebrar o build se ele precisar de devDependencies
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
# O comando 'next' deve estar acessível agora pois as dependências foram instaladas com o contexto completo
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
# O server.js é parte do output standalone
CMD ["node", "apps/web/server.js"]

# --- Alternativa sem standalone (menos otimizado) ---
# Se você não estiver usando 'output: "standalone"', comente as linhas COPY e CMD acima e descomente as abaixo:
# COPY --from=builder /app/node_modules ./node_modules
# COPY --from=builder /app/apps/web ./apps/web
# COPY --from=builder /app/packages ./packages
# COPY --from=builder /app/config ./config
# COPY --from=builder /app/package.json ./package.json
# COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
# COPY --from=builder /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
# CMD ["pnpm", "--filter", "@ck/web", "start"]

