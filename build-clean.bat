@echo off
echo Building FarmApp for Windows (Clean Config - No Icons)...
echo ==============================================================

echo Using clean configuration without any icon processing...
npx electron-builder --win --config electron-builder-clean.json

if %errorlevel% equ 0 (
    echo.
    echo ✅ Build successful!
    echo Check the dist\ folder for your installer
    echo.
    echo Files created:
    dir dist\*.exe 2>nul
    echo.
    echo Your FarmApp desktop app is ready for installation!
    echo Note: Using default Electron icon to avoid build issues.
) else (
    echo.
    echo ❌ Build failed. Check the error messages above.
)

pause
