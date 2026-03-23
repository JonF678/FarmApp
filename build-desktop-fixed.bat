@echo off
echo Building Fixed Desktop Version...
echo ==================================

echo Step 1: Clean previous builds...
if exist "dist" rmdir /s /q dist

echo Step 2: Building Windows installer...
npx electron-builder --win --config electron-builder.json --publish=never

if %errorlevel% equ 0 (
    echo.
    echo ✅ Desktop build successful!
    echo.
    echo Files created in dist\ folder:
    dir dist\*.exe 2>nul
    echo.
    echo To test the app before installation:
    echo 1. Double-click "debug-electron.bat" for testing
    echo 2. Install using "dist\FarmApp Setup 1.0.0.exe"
    echo.
) else (
    echo.
    echo ❌ Build failed. Trying debug mode...
    echo Running debug version to test...
    npx electron electron/debug-main.js
)

pause
