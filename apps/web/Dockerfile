# Etapa 1: build
FROM node:20 AS builder

# Habilita o corepack e instala o pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Diretório de trabalho
WORKDIR /app

# Copia o monorepo inteiro
COPY . .

# Instala dependências e builda tudo
RUN pnpm install
RUN pnpm turbo run build --filter=web...

# Etapa 2: container leve para produção
FROM node:20-alpine AS runner

WORKDIR /app

# Habilita o pnpm só se precisar rodar comandos em runtime
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copia apenas os arquivos buildados
COPY --from=builder /app/apps/web/.next .next
COPY --from=builder /app/apps/web/public public
COPY --from=builder /app/apps/web/package.json .
COPY --from=builder /app/node_modules node_modules

EXPOSE 3000

# Inicia a aplicação (Next.js)
CMD ["pnpm", "start"]
