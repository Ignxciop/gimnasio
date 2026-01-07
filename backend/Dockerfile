FROM node:20-alpine

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY prisma ./prisma/
RUN pnpm prisma generate

COPY --chown=nodejs:nodejs . .

RUN mkdir -p /app/resources/user_photo && \
    chown -R nodejs:nodejs /app/resources

USER nodejs

EXPOSE 4001

CMD ["node", "index.js"]
