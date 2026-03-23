#!/bin/bash

echo "🖥️  Poultry Manager Desktop Build Script"
echo "========================================"

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install Node.js and npm first."
    exit 1
fi

# Install electron and electron-builder as dev dependencies
echo "📦 Installing desktop dependencies..."
npm install --save-dev electron@^37.2.5 electron-builder@^26.0.12 wait-on@^7.0.1

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully!"
echo ""

echo "🚀 Available build commands:"
echo "  Development mode: npx electron electron/main.js"
echo "  Build for current platform: npx electron-builder --config electron-builder.json"
echo "  Build for Windows: npx electron-builder --win --config electron-builder.json"
echo "  Build for macOS: npx electron-builder --mac --config electron-builder.json"
echo "  Build for Linux: npx electron-builder --linux --config electron-builder.json"
echo "  Build for all platforms: npx electron-builder --mac --win --linux --config electron-builder.json"
echo ""

echo "🎯 To test the desktop app right now:"
echo "  npx electron electron/main.js"
echo ""
echo "📋 Build troubleshooting:"
echo "  If you get 'cannot compute electron version' error:"
echo "  1. Make sure node_modules/electron exists"
echo "  2. The electronVersion is now fixed in electron-builder.json"
echo "  3. Try: npx electron-builder --config electron-builder.json"