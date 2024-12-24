# Stage 1: Build the application
FROM node:18 AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

ENV NODE_OPTIONS="--max-old-space-size=4096"

# Build the Next.js application
RUN npm run build

# Install the "sharp" package for production image optimization
RUN npm install sharp

# Stage 2: Production container
FROM node:18-slim AS runner

# Set NODE_ENV to production
ENV NODE_ENV=production

# Set the working directory
WORKDIR /app

# Copy the built application from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public

# Expose the application port
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "run", "start"]
