#!/bin/bash -e

# Check if the vault path is provided
if [ "$#" -ne 1 ]; then
  echo "Usage: $0 path_to_vault"
  exit 1
fi

VaultDir=$1
PluginId="$(jq -r '.id' ./manifest.json)"
PluginDir=$VaultDir/.obsidian/plugins/$PluginId

# Build the plugin
echo "Building the plugin..."
bun run build

# Copy the necessary files
echo "Deploying the plugin to the vault..."

mkdir -p $PluginDir
cp main.js $PluginDir
cp styles.css $PluginDir
cp manifest.json $PluginDir

echo "Deployment complete."
