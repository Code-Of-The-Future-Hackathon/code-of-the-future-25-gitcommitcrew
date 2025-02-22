#!/bin/bash

# Start the jump server in the background
bun run src/jump-server/index.ts &

# Start the main host service
bun run src/index.ts -- setup
