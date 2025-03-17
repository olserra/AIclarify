#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting publish process..."

# Clean all dist folders
echo "🧹 Cleaning dist folders..."
npm run clean

# Build the project
echo "🏗️ Building project..."
npm run build

# Check if we're on main branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "❌ You must be on the main branch to publish"
    exit 1
fi

# Check if there are uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo "❌ You have uncommitted changes. Please commit or stash them before publishing."
    exit 1
fi

# Increment version and publish
echo "📦 Incrementing version..."
bash scripts/version.sh patch

# Commit version changes
git add package.json
git commit -m "chore: bump version"

# Publish package
echo "📦 Publishing package..."
npm publish --access public

echo "✅ Publish complete!" 