#!/bin/sh
# env.sh - Inject runtime environment variables into the built React app

echo "========================================"
echo "Runtime Environment Configuration"
echo "========================================"
echo "API_URL from environment: '${API_URL}'"
echo "VITE_API_URL from environment: '${VITE_API_URL}'"
echo "========================================"

# Use API_URL or VITE_API_URL (priority to API_URL for clarity)
FINAL_API_URL="${API_URL:-${VITE_API_URL}}"

if [ -z "$FINAL_API_URL" ]; then
  echo "ERROR: No API_URL or VITE_API_URL provided!"
  echo "Please set API_URL environment variable in docker-compose.yml"
  exit 1
fi

echo "Using API URL: $FINAL_API_URL"

# Create env-config.js with runtime environment variables
cat > /usr/share/nginx/html/env-config.js <<EOF
window.__ENV__ = {
  API_URL: "$FINAL_API_URL"
};
EOF

echo "Generated env-config.js:"
cat /usr/share/nginx/html/env-config.js
echo "========================================"

# Start nginx
exec "$@"
