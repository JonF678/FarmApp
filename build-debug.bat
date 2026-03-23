@echo off
echo Building DEBUG version of Poultry Manager...
echo ===============================================

echo This will create a simple debug version to test if Electron works
npx electron-builder --config electron-builder-debug.json --win

if %errorlevel% equ 0 (
    echo.
    echo ✅ Debug build successful!
    echo Check the dist-debug\ folder for the portable executable
    echo.
    echo The debug version will show:
    echo - Console logs in a command window
    echo - Simple test message if Electron works
    echo - Error messages if something fails
    echo.
    dir dist-debug\*.exe 2>nul
) else (
    echo.
    echo ❌ Debug build failed. Check the error messages above.
)

pause