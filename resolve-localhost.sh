#!/bin/bash

# Get the local IP address (excluding loopback)
LOCAL_IP=$(hostname -I | awk '{print $1}')

if [ -z "$LOCAL_IP" ]; then
    echo "Error: Could not determine local IP address"
    exit 1
fi

echo "Replacing any IP/localhost:8443 with ${LOCAL_IP}:8443..."

# Pattern to match any IP address or localhost followed by :8443
# Matches: localhost:8443, 127.0.0.1:8443, 10.13.3.4:8443, etc.
PATTERN='[a-zA-Z0-9.-]*:8443'

# Find and replace in backend files (js, cjs)
find backend -type f \( -name "*.js" -o -name "*.cjs" \) -exec \
    sed -i -E "s/(['\"\`\/])([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}|localhost):8443/\1${LOCAL_IP}:8443/g" {} \;

# Replace in config files at root level
for file in .env docker-compose.yml; do
    if [ -f "$file" ]; then
        sed -i -E "s/(['\"\`\/])([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}|localhost):8443/\1${LOCAL_IP}:8443/g" "$file"
    fi
done

# Update cache-busting version in index.html
TIMESTAMP=$(date +%s)
sed -i -E "s/(main\.js\?v=)[0-9]+/\1${TIMESTAMP}/" frontend/src/index.html

echo "Done! Replaced with ${LOCAL_IP}:8443 (cache version: ${TIMESTAMP})"
