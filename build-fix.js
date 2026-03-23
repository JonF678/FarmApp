// Fix for electron-builder version detection issue
const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing electron-builder configuration...');

// Read current electron version
const electronPackage = require('./node_modules/electron/package.json');
const electronVersion = electronPackage.version;

console.log(`📦 Detected Electron version: ${electronVersion}`);

// Read current electron-builder config
const configPath = './electron-builder.json';
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

// Ensure electronVersion is set
config.electronVersion = electronVersion;

// Write updated config
fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

console.log('✅ Configuration updated with fixed electron version');
console.log('');
console.log('🚀 Ready to build! Try these commands:');
console.log('  npx electron-builder --config electron-builder.json');
console.log('  npx electron-builder --win --config electron-builder.json');
console.log('  npx electron-builder --mac --config electron-builder.json');
console.log('  npx electron-builder --linux --config electron-builder.json');