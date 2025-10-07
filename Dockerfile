# Use official Node.js 20 Alpine for smaller size
FROM node:20-alpine AS base

# -----------------------------
# Step 1 — Install dependencies
# -----------------------------
FROM base AS deps
WORKDIR /app

COPY package*.json ./
RUN apk add --no-cache libc6-compat && npm ci --ignore-scripts --prefer-offline --no-audit

# -----------------------------
# Step 2 — Build the app
# -----------------------------
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY package*.json ./
COPY . .

ARG NEXT_PUBLIC_TMDB_TOKEN
ARG NEXT_PUBLIC_TMDB_API_KEY  
ARG NEXT_PUBLIC_APP_URL="https://my-movie-dashboard.onrender.com"
ARG NEXT_PUBLIC_SITE_NAME

ENV NEXT_PUBLIC_TMDB_TOKEN=${NEXT_PUBLIC_TMDB_TOKEN}
ENV NEXT_PUBLIC_TMDB_API_KEY=${NEXT_PUBLIC_TMDB_API_KEY}
ENV NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL}
ENV NEXT_PUBLIC_SITE_NAME=${NEXT_PUBLIC_SITE_NAME}
ENV NEXT_TELEMETRY_DISABLED=1
ENV SKIP_ENV_VALIDATION=1

RUN npm run build

# -----------------------------
# Step 3 — Production image
# -----------------------------
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]