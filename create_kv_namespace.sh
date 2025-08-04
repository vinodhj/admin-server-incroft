#!/bin/bash

# Script to create both production and preview KV namespaces
# Usage: ./create_kv_namespace.sh <namespace_name>
# Example: ./create_kv_namespace.sh KV_INCROFT_JWT_AUTH
#
# This will create:
# 1. npx wrangler kv namespace create KV_INCROFT_JWT_AUTH
# 2. npx wrangler kv namespace create KV_INCROFT_JWT_AUTH --preview
#
# Add this to your package.json scripts section:
# "create-kv": "bash scripts/create_kv_namespace.sh"
#
# Then use: npm run create-kv KV_INCROFT_JWT_AUTH

set -e  # Exit on any error

# Function to display usage
usage() {
    echo "Usage: $0 <namespace_name>"
    echo "Example: $0 KV_INCROFT_JWT_AUTH"
    echo "This will create both production and preview KV namespaces"
    exit 1
}

# Check if namespace name is provided
if [ $# -eq 0 ]; then
    echo "Error: Namespace name is required"
    usage
fi

NAMESPACE_NAME="$1"

# Validate namespace name (basic validation)
if [[ ! "$NAMESPACE_NAME" =~ ^[A-Za-z0-9_-]+$ ]]; then
    echo "Error: Namespace name should only contain letters, numbers, underscores, and hyphens"
    exit 1
fi

echo "Creating KV namespaces for: $NAMESPACE_NAME"
echo "1. Creating production namespace..."

# Execute the production wrangler command
if npx wrangler kv namespace create "$NAMESPACE_NAME"; then
    echo "✅ Successfully created production KV namespace: $NAMESPACE_NAME"
else
    echo "❌ Failed to create production KV namespace: $NAMESPACE_NAME"
    exit 1
fi

echo ""
echo "2. Creating preview namespace..."

# Execute the preview wrangler command
if npx wrangler kv namespace create "$NAMESPACE_NAME" --preview; then
    echo "✅ Successfully created preview KV namespace: $NAMESPACE_NAME (preview)"
else
    echo "❌ Failed to create preview KV namespace: $NAMESPACE_NAME"
    exit 1
fi

echo ""
echo "🎉 Both namespaces created successfully!"
echo "📝 Remember to add the namespace IDs to your wrangler.toml file"