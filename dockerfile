# Use the official Playwright image with Chromium pre-installed
FROM mcr.microsoft.com/playwright:v1.49.1-jammy

WORKDIR /app

# Install Chromium browser for ARM64
RUN apt-get update && \
    apt-get install -y chromium-browser && \
    rm -rf /var/lib/apt/lists/*

# Create necessary directories
RUN mkdir -p /app/browser-profile /app/qr-codes

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy remaining files
COPY . .

# Set proper permissions and cleanup script
RUN chmod -R 777 /app/browser-profile /app/qr-codes \
    && echo '#!/bin/bash\nrm -f /app/browser-profile/SingletonLock\nexec "$@"' > /docker-entrypoint.sh \
    && chmod +x /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]
