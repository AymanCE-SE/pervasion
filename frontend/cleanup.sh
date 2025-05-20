#!/bin/bash

# Remove redundant i18n file
rm -f src/i18n/i18n.js

# Remove redundant API service
rm -f src/services/api.js

# Remove any backup files
find . -name "*.bak" -type f -delete
find . -name "*.swp" -type f -delete

# Remove node_modules and reinstall
rm -rf node_modules
npm install

echo "Cleanup complete!"
