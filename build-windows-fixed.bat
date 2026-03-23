@echo off
echo Building Poultry Manager for Windows (Icon Issue Fixed)...
echo =========================================================

echo Building Windows installer without problematic icon...
npx electron-builder --win --config electron-builder.json

if %errorlevel% equ 0 (
    echo.
    echo ✅ Build successful!
    echo Check the dist\ folder for your installer
    echo.
    echo Files created:
    dir dist\*.exe 2>nul
    echo.
    echo Your Poultry Manager desktop app is ready for installation!
    echo Note: The app will use the default Electron icon since the custom icon had format issues.
) else (
    echo.
    echo ❌ Build failed. Check the error messages above.
)

pause