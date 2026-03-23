@echo off
echo Testing Electron with Correct Package Config...
echo ===============================================

echo Step 1: Testing minimal Electron first...
npx electron test-minimal.js

echo.
echo Step 2: Testing with correct package.json...
copy package-electron.json package.json
npx electron electron/main.js

echo.
echo If both tests work, your desktop app should be fixed!
pause