# Stage 1: Install dependencies
FROM node:24-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@11.15.1 --activate

COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile --config.ignore-scripts=true

# Stage 2: Build Next.js application
FROM node:24-alpine AS builder
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@11.15.1 --activate

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

ARG NEXT_PUBLIC_TD_RETAIL_API_URL=https://tdretail-215785827581.asia-southeast1.run.app
ARG NEXT_PUBLIC_MERCHANT_ID=merchant_b
ENV NEXT_PUBLIC_TD_RETAIL_API_URL=$NEXT_PUBLIC_TD_RETAIL_API_URL
ENV NEXT_PUBLIC_MERCHANT_ID=$NEXT_PUBLIC_MERCHANT_ID

RUN pnpm run build

# Stage 3: Minimal production runner for Google Cloud Run
FROM node:24-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080
ENV HOSTNAME="0.0.0.0"

ARG NEXT_PUBLIC_TD_RETAIL_API_URL=https://tdretail-215785827581.asia-southeast1.run.app
ARG NEXT_PUBLIC_MERCHANT_ID=merchant_b
ENV NEXT_PUBLIC_TD_RETAIL_API_URL=$NEXT_PUBLIC_TD_RETAIL_API_URL
ENV NEXT_PUBLIC_MERCHANT_ID=$NEXT_PUBLIC_MERCHANT_ID

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 8080

CMD ["node", "server.js"]
