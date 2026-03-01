# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Stage 2: Production Runtime
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Security: Run as non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Only copy production code and dependencies (keeps image size tiny)
COPY --from=builder --chown=appuser:appgroup /app/package*.json ./
COPY --from=builder --chown=appuser:appgroup /app/node_modules ./node_modules
COPY --from=builder --chown=appuser:appgroup /app/src ./src
COPY --from=builder --chown=appuser:appgroup /app/scripts ./scripts
COPY --from=builder --chown=appuser:appgroup /app/schema.sql ./schema.sql

EXPOSE 3015 
CMD ["node", "src/app.js"]