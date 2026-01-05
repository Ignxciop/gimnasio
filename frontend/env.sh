#!/bin/sh
# env.sh - Inject runtime environment variables into the built React app

# Create env-config.js with runtime environment variables
cat <<EOF > /usr/share/nginx/html/env-config.js
window.ENV = {
  VITE_API_URL: "${VITE_API_URL:-https://api.gimnasio.josenunez.cl}"
};
EOF

echo "Environment configuration generated:"
cat /usr/share/nginx/html/env-config.js

# Execute the CMD
exec "$@"
