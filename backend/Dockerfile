# Build Stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production Stage
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY --from=builder /app/dist ./dist
# Prisma client needs to be generated in prod too or copied
COPY prisma ./prisma
RUN npx prisma generate

EXPOSE 5000
CMD ["node", "dist/server.js"]
