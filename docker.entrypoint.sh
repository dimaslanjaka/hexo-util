#!/bin/bash
# This script is used to run tests in a Docker container for the hexo-util package.

# Set ROOT_DIR to the directory of the current script
ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
PACKAGE_JSON="$ROOT_DIR/package.json"

# Remove packageManager from package.json
export PACKAGE_JSON
node -e '
  const fs = require("fs");
  const path = process.env.PACKAGE_JSON;
  if (!path) throw new Error("PACKAGE_JSON env var is not set.");
  const data = JSON.parse(fs.readFileSync(path, "utf8"));
  delete data.packageManager;
  fs.writeFileSync(path, JSON.stringify(data, null, 2) + "\n");
'

mkdir -p tmp/logs

# Run tests
if command -v tee >/dev/null 2>&1; then
  npm test 2>&1 | tee tmp/logs/node-14.test.log
else
  npm test > tmp/logs/node-14.test.log 2>&1
fi
