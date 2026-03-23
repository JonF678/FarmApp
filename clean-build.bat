@echo off
echo Cleaning build environment...

REM Kill any running processes
taskkill /f /im "Poultry Manager.exe" 2>nul
taskkill /f /im electron.exe 2>nul
taskkill /f /im node.exe 2>nul

REM Wait a moment for processes to close
timeout /t 3 /nobreak >nul

REM Remove build directories
if exist "dist" (
    echo Removing dist folder...
    rmdir /s /q "dist"
)

if exist "node_modules\.cache" (
    echo Clearing electron cache...
    rmdir /s /q "node_modules\.cache"
)

REM Clear npm cache for electron
npx electron-builder clean

echo Clean completed!
echo You can now run build-windows.bat safely.
pause