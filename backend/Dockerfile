FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm@10.25.0

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY prisma ./prisma/
RUN pnpm prisma generate

COPY . .

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 3000

CMD ["sh", "-c", "pnpm prisma migrate deploy && node index.js"]
