# Stage 1: Build stage
FROM node:22-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Final runner stage
FROM node:22-slim AS runner
WORKDIR /app

ENV NODE_ENV production

# Only copy the essential files from the standalone build
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

ENV PORT 3000

# Next.js standalone creates a server.js file
CMD ["node", "server.js"]
