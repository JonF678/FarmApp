@echo off
echo Building Poultry Management Desktop App for Windows...
echo.

REM Kill any running Electron processes
echo Stopping any running Electron processes...
taskkill /f /im "FarmApp.exe" 2>nul
taskkill /f /im electron.exe 2>nul
timeout /t 2 /nobreak >nul

REM Clean previous build
echo Cleaning previous build...
if exist "dist" (
    rmdir /s /q "dist" 2>nul
    timeout /t 1 /nobreak >nul
)

REM Copy the correct package.json for Electron
echo Setting up Electron configuration...
copy package-electron.json package.json

REM Build the application
echo Building application...
echo NOTE: Authentication system has been updated with enhanced desktop security
npx electron-builder --win --config electron-builder.json

echo.
if %ERRORLEVEL% EQU 0 (
    echo ✓ Build completed successfully!
    echo ✓ Installer created in: dist\
    echo ✓ Unpacked app available in: dist\win-unpacked\
    echo.
    echo You can now:
    echo 1. Install using: dist\FarmApp Setup 1.0.0.exe
    echo 2. Or run directly from: dist\win-unpacked\FarmApp.exe
) else (
    echo ✗ Build failed with error code %ERRORLEVEL%
    echo.
    echo Troubleshooting tips:
    echo 1. Make sure no Electron apps are running
    echo 2. Try running as Administrator
    echo 3. Check if antivirus is blocking the build
)

pause
