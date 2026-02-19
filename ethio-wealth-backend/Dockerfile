FROM node:18-alpine

WORKDIR /app

# Install dependencies (cache optimized)
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Expose API port
EXPOSE 3000

# Start Application
CMD ["npm", "start"]
