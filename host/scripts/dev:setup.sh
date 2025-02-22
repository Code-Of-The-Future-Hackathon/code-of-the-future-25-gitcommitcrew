#!/bin/bash

# Ignore SIGTERM
trap '' SIGTERM

# pkill bun
bun --bun run ./src/index.ts -- setup