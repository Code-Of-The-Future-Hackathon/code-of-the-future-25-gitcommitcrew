FROM oven/bun:latest

WORKDIR /app

COPY host/package.json .
COPY host/tsconfig.json .
COPY host/bun.lock .
COPY host/src/ ./src/

RUN bun install

CMD ["bun", "run", "src/index.ts", "--", "setup"]