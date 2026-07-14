FROM oven/bun:1 AS builder
WORKDIR /app

# Copy dependency files
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy the rest of the app
COPY . .

# Build the app using Nitro's node-server preset
ENV NITRO_PRESET=node-server
RUN bun run build

# Production runtime stage
FROM oven/bun:1-slim
WORKDIR /app

# Copy the built output from builder
COPY --from=builder /app/.output ./.output

# Expose port 80
EXPOSE 80
ENV PORT=80
ENV HOST=0.0.0.0
ENV NODE_ENV=production

# Start the Node/Bun server
CMD ["bun", "run", ".output/server/index.mjs"]
