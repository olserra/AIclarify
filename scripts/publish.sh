#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting publish process..."

# Clean all dist folders
echo "🧹 Cleaning dist folders..."
pnpm clean

# Build all packages
echo "🏗️ Building packages..."
pnpm build:all

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
echo "📦 Publishing packages..."
pnpm publish

echo "✅ Publish complete!" 