# FORCE REBUILD - DO NOT CACHE
ARG CACHEBUST=1739594339

FROM node:22-alpine AS builder
RUN apk add --no-cache python3 make g++ linux-headers eudev-dev libusb-dev
WORKDIR /app
COPY app/ .
RUN npm install
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
ENV PORT=3000
CMD ["node", "server.js"]
