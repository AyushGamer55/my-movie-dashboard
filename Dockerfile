# Use faster Node.js image with better I/O
FROM node:20-slim AS base

# -----------------------------
# Step 1 — Install dependencies FAST
# -----------------------------
FROM base AS deps
RUN apt-get update && apt-get install -y libc6-dev && rm -rf /var/lib/apt/lists/*
WORKDIR /app

# Copy package files
COPY package*.json ./

# Use cache mount for npm cache + parallel downloads
RUN --mount=type=cache,target=/root/.npm \
    npm ci --ignore-scripts --prefer-offline --no-audit --maxsockets=10

# -----------------------------
# Step 2 — Build the app FAST
# -----------------------------
FROM base AS builder
WORKDIR /app

# Copy deps with cache mount
COPY --from=deps --link /root/.npm /root/.npm
COPY --from=deps --link /app/node_modules ./node_modules
COPY package*.json ./

# Copy source files efficiently
COPY . .

# Build args
ARG NEXT_PUBLIC_TMDB_TOKEN
ARG NEXT_PUBLIC_TMDB_API_KEY
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_SITE_NAME

ENV NEXT_PUBLIC_TMDB_TOKEN=${NEXT_PUBLIC_TMDB_TOKEN}
ENV NEXT_PUBLIC_TMDB_API_KEY=${NEXT_PUBLIC_TMDB_API_KEY}
ENV NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL}
ENV NEXT_PUBLIC_SITE_NAME=${NEXT_PUBLIC_SITE_NAME}
ENV NEXT_TELEMETRY_DISABLED=1
ENV SKIP_ENV_VALIDATION=1

# Use cache mount for Next.js build cache
RUN --mount=type=cache,target=/app/.next/cache \
    npm run build

# -----------------------------
# Step 3 — Production image
# -----------------------------
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1


RUN groupadd --system --gid 1001 nodejs
RUN useradd --system --uid 1001 nextjs

# Copy built app efficiently
COPY --from=builder --link --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --link --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --link --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
