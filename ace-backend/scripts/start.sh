#!/bin/sh
set -e
echo "Running migrations..."
node_modules/.bin/tsx scripts/migrate.ts
echo "Starting server..."
exec node dist/index.js
