FROM oven/bun:latest

# Install OpenSSH
RUN apt-get update && apt-get install -y openssh-client openssh-server && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY host/package.json .
COPY host/tsconfig.json .
COPY host/bun.lock .
COPY host/src/ ./src/

RUN bun install

# Copy and make the entrypoint script executable
COPY host/scripts/docker-entrypoint.sh /
RUN chmod +x /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]
