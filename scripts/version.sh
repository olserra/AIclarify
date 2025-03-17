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

# Get current version from package.json
current_version=$(node -e "console.log(require('./package.json').version)")

# Increment version based on argument
if [ -z "$1" ]; then
    echo "Please specify version increment type: major, minor, or patch"
    exit 1
fi

new_version=$(increment_version "$current_version" "$1")

echo "🔄 Updating version from $current_version to $new_version"

# Update package.json
node -e "const pkg=require('./package.json'); pkg.version='$new_version'; require('fs').writeFileSync('package.json', JSON.stringify(pkg, null, 2))"

echo "✅ Version updated to $new_version" 