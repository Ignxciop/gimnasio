FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm@10.25.0

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod=false

COPY prisma .backend/prisma/
RUN pnpm prisma generate

COPY . .

EXPOSE 3000

CMD ["sh", "-c", "pnpm prisma migrate deploy && node index.js"]
