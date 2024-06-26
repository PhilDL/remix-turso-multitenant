# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=20.11.0
FROM node:${NODE_VERSION}-slim as base
RUN corepack enable
LABEL fly_launch_runtime="Remix"

# Remix app lives here
WORKDIR /app


# Throw-away build stage to reduce size of final image
FROM base as build
RUN corepack enable
# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install -y build-essential pkg-config python-is-python3 openssl ca-certificates

# Copy application code
COPY --link . .

# Install node modules
COPY --link pnpm-lock.yaml package.json ./
RUN pnpm install 



# Build application
RUN pnpm run build

# Set production environment
ENV NODE_ENV="production"
# Remove development dependencies
# RUN pnpm prune --prod


# Final stage for app image
FROM base
RUN apt-get update -qq && \
    apt-get install -y openssl ca-certificates
RUN corepack enable
# Copy built application
COPY --from=build /app /app
RUN mkdir -p /data

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
CMD [ "pnpm", "run", "start" ]
