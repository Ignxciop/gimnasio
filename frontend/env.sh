#!/bin/sh
# env.sh - Inject runtime environment variables into the built React app

echo "Generating environment configuration..."
echo "VITE_API_URL: ${VITE_API_URL}"

# Create env-config.js with runtime environment variables
cat > /usr/share/nginx/html/env-config.js <<EOF
window.ENV = {
  VITE_API_URL: "${VITE_API_URL:-https://api.gimnasio.josenunez.cl}"
};
EOF

echo "Environment configuration generated:"
cat /usr/share/nginx/html/env-config.js

# Start nginx
exec "$@"
