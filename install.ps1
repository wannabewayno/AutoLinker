$ErrorActionPreference = "Stop"

# Check if the vault path is provided
if ($args.Length -ne 1) {
  Write-Host "[Error]: Vault Directory path is required as the first argument"
  exit 1
}

$VaultDir = $args[0]
$PluginId = (Get-Content -Raw ./manifest.json | ConvertFrom-Json).id
$PluginDir = "$VaultDir/.obsidian/plugins/$PluginId"

# Build the plugin
Write-Host "Building the plugin..."
npm run build

# Copy the necessary files
Write-Host "Deploying the plugin to the vault..."
if (!(Test-Path -Path $PluginDir)) {
    New-Item -ItemType Directory -Force -Path "$PluginDir"
}

Copy-Item main.js $PluginDir
Copy-Item styles.css $PluginDir
Copy-Item manifest.json $PluginDir

Write-Host "Deployment complete."