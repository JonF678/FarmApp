@echo off
echo Fixing Desktop App Configuration and Building...
echo ==============================================

echo Step 1: Backing up original package.json...
copy package.json package-original.json

echo Step 2: Using desktop-optimized package.json...
copy package-electron.json package.json

echo Step 3: Testing Electron with new config...
echo Testing minimal version first...
npx electron test-minimal.js

echo.
echo Step 4: If test worked, building full desktop app...
npx electron-builder --win --config electron-builder.json

if %errorlevel% equ 0 (
    echo.
    echo ✅ Desktop app built successfully!
    echo Check the dist\ folder for your installer.
    echo.
    echo To restore original config later:
    echo copy package-original.json package.json
) else (
    echo.
    echo ❌ Build failed. Restoring original package.json...
    copy package-original.json package.json
)

pause