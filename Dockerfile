# Use official Node.js 20 Alpine for smaller size
FROM node:20-alpine AS base

# -----------------------------
# Step 1 — Install dependencies
# -----------------------------
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (simpler approach for Render)
RUN npm ci --ignore-scripts --prefer-offline --no-audit

# -----------------------------
# Step 2 — Build the app
# -----------------------------
FROM base AS builder
WORKDIR /app

# Copy dependencies and package files
COPY --from=deps /app/node_modules ./node_modules
COPY package*.json ./

# Copy source code
COPY . .

# Build args and env vars
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

# Build the app
RUN npm run build

# -----------------------------
# Step 3 — Production image
# -----------------------------
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built app
COPY --from=builder /app/.next/standalone ./.next/standalone
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", ".next/standalone/server.js"]
