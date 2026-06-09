# Stage 1: Build stage
FROM node:22-slim AS builder
WORKDIR /app

# Define build-time arguments
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_FRONTEND_URL

# Set them as environment variables
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_FRONTEND_URL=$NEXT_PUBLIC_FRONTEND_URL

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Final runner stage
FROM node:22-slim AS runner
WORKDIR /app

ENV NODE_ENV=production

# Only copy the essential files from the standalone build
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

ENV PORT=3000

# Next.js standalone creates a server.js file
CMD ["node", "server.js"]
