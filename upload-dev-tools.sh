#!/bin/bash
# Upload dev-tools.html to R2 storage

echo "?? Uploading dev-tools.html to R2..."

# IMPORTANT: use --remote so the deployed Worker can read it
wrangler r2 object put autonomous-coding-agent/dev-tools.html --file=./dev-tools.html --content-type="text/html" --remote

echo "? Uploaded dev-tools.html to R2 bucket: autonomous-coding-agent"
echo "?? The dev tools page will now be served from R2"
