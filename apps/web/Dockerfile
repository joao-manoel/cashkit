# Etapa 1: Builder
FROM node:20 AS builder

# Habilita o pnpm via corepack
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

# Define diretório de trabalho
WORKDIR /app

# Copia tudo (monorepo inteiro) para dentro do container
COPY . .

# Instala dependências do monorepo
RUN pnpm install

# Builda apenas o app web com filtro Turbo
RUN pnpm turbo run build --filter=@ck/web...

# Etapa 2: Runner leve com Alpine
FROM node:20-alpine AS runner

# Habilita pnpm (caso precise no runtime)
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

WORKDIR /app

# Copia os arquivos necessários da build
COPY --from=builder /app/apps/web/.next .next
COPY --from=builder /app/apps/web/public public
COPY --from=builder /app/apps/web/package.json .
COPY --from=builder /app/node_modules node_modules

# Define variáveis de ambiente (exemplo)
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# Inicia o servidor Next.js
CMD ["pnpm", "start"]
