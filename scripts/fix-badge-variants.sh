#!/bin/bash

# Fix all Badge variant="outline" to variant="secondary"
# Fix all Badge variant="destructive" to variant="error"

echo "Fixing Badge variants..."

# Find and replace outline with secondary
find src/app/admin -name "*.tsx" -type f -exec sed -i 's/variant="outline"/variant="secondary"/g' {} +

# Find and replace destructive with error  
find src/app/admin -name "*.tsx" -type f -exec sed -i 's/variant="destructive"/variant="error"/g' {} +

echo "✅ Done! Now run: npm run build"

