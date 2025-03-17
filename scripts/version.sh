#!/bin/bash

# Exit on error
set -e

# Function to increment version
increment_version() {
    local version=$1
    local increment_type=$2

    IFS='.' read -r -a version_parts <<< "$version"
    local major=${version_parts[0]}
    local minor=${version_parts[1]}
    local patch=${version_parts[2]}

    case $increment_type in
        "major")
            major=$((major + 1))
            minor=0
            patch=0
            ;;
        "minor")
            minor=$((minor + 1))
            patch=0
            ;;
        "patch")
            patch=$((patch + 1))
            ;;
        *)
            echo "Invalid increment type. Use major, minor, or patch"
            exit 1
            ;;
    esac

    echo "$major.$minor.$patch"
}

# Current version from npm registry (hardcoded for now)
current_version="0.2.4"

# Increment version based on argument
if [ -z "$1" ]; then
    echo "Please specify version increment type: major, minor, or patch"
    exit 1
fi

new_version=$(increment_version "$current_version" "$1")

echo "🔄 Updating version from $current_version to $new_version"

# Update root package.json
node -e "const pkg=require('./package.json'); pkg.version='$new_version'; require('fs').writeFileSync('package.json', JSON.stringify(pkg, null, 2))"

# Update core package.json
node -e "const pkg=require('./packages/core/package.json'); pkg.version='$new_version'; require('fs').writeFileSync('./packages/core/package.json', JSON.stringify(pkg, null, 2))"

# Update dashboard package.json
node -e "const pkg=require('./packages/dashboard/package.json'); pkg.version='$new_version'; require('fs').writeFileSync('./packages/dashboard/package.json', JSON.stringify(pkg, null, 2))"

# Update shared-components package.json
node -e "const pkg=require('./packages/shared-components/package.json'); pkg.version='$new_version'; require('fs').writeFileSync('./packages/shared-components/package.json', JSON.stringify(pkg, null, 2))"

echo "✅ Version updated to $new_version in all packages" 