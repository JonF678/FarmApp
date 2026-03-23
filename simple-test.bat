@echo off
echo Testing Electron directly...
echo ===========================

echo Starting Electron with debug main file...
npx electron electron/debug-main.js

echo.
echo If a window opened and closed, Electron is working.
echo If nothing happened, there may be a deeper issue.
pause