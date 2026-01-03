FROM node:20-alpine

RUN npm install -g pnpm@10.25.0

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod=false

COPY prisma ./prisma/
RUN pnpm prisma generate

COPY . .

EXPOSE 3000

CMD ["sh", "-c", "pnpm prisma migrate deploy && node index.js"]
