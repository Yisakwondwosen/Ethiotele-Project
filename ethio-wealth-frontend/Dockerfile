# syntax=docker/dockerfile:1
# Stage 1: Build Frontend
FROM node:20-alpine AS builder
WORKDIR /app

# Ensure Build Environment Variables are Available
ARG VITE_API_URL
ARG VITE_FAYDA_CLIENT_ID
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_FAYDA_CLIENT_ID=$VITE_FAYDA_CLIENT_ID

# Copy package config
COPY package*.json ./

# Install dependencies (lockfile was updated locally, so this will pass now)
# We add extreme network timeouts to handle Docker Desktop on Mac dropping packets
RUN npm install \
    --prefer-offline \
    --fetch-retry-mintimeout=20000 \
    --fetch-retry-maxtimeout=120000 \
    --fetch-retries=5

# Copy source and build
COPY . .
RUN npm run build

# Stage 2: Production Runtime with Nginx
FROM nginx:stable-alpine
WORKDIR /usr/share/nginx/html

# Wipe default Nginx content
RUN rm -rf ./*

# Copy the compiled Vite output
COPY --from=builder /app/dist .

# Custom Nginx reverse-proxy configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
