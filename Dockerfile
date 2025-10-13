# ---------------------------
# Build stage
# ---------------------------
FROM oven/bun:1 AS base

WORKDIR /app

# Copy package files từ đúng location
COPY agrisa_admin/package*.json agrisa_admin/bun.lock* ./

# Install all dependencies (include devDependencies for build)
RUN bun install

# Copy toàn bộ source code
COPY agrisa_admin/ ./

# Copy .env từ root (nếu cần)
COPY .env .env

# Build Next.js app
RUN bun run build

# ---------------------------
# Production stage
# ---------------------------
FROM oven/bun:1 AS runner

WORKDIR /app

# Copy only built app + node_modules
COPY --from=base /app ./

# Env vars
ENV BUN_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3001

EXPOSE 3001

CMD ["bun", "run", "start"]