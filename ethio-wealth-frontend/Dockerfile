# Stage 1: Build Frontend
FROM node:20-alpine AS builder
WORKDIR /app

# Ensure Build Environment Variables are Available
ARG VITE_API_URL
ARG VITE_FAYDA_CLIENT_ID
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_FAYDA_CLIENT_ID=$VITE_FAYDA_CLIENT_ID

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Production Runtime with Nginx
FROM nginx:stable-alpine
WORKDIR /usr/share/nginx/html

# Replace standard default nginx index with our custom one
RUN rm -rf ./*
COPY --from=builder /app/dist .

# Copy our custom Nginx Proxy configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Security: Nginx runs as root by default to bind to port 80. 
# Changing it safely to unprivileged requires standardizing on 8080 usually.
# We keep port 80 for proxy compatibility but ensure the container is as thin as possible.
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
