FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm typescript tsx tsup

COPY . .

RUN pnpm install --frozen-lockfile

WORKDIR /app/apps/api

RUN pnpm prisma generate

RUN pnpm build

RUN chmod +x entrypoint.sh


EXPOSE 1010

CMD ["./entrypoint.sh"]
