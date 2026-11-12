@echo off
title TaskFlow - Starting Application
cls

echo ========================================================
echo       TaskFlow - Modern Task Management Application
echo ========================================================
echo.
echo [1/3] Setting up Node.js and Git environment...
set "PATH=C:\Users\%USERNAME%\.local\node-v20.18.0-win-x64;C:\Program Files\Git\cmd;%PATH%"

cd /d "%~dp0"

echo [2/3] Checking dependencies and build...
if not exist "client\dist\index.html" (
    echo Building frontend for first time...
    call npm run build
)

echo [3/3] Starting TaskFlow Server on http://localhost:5000...
echo.
echo Opening TaskFlow in your default browser...
start http://localhost:5000

echo.
echo ========================================================
echo   TaskFlow is running at http://localhost:5000
echo   Keep this window open while using the application.
echo ========================================================
echo.

node server\server.js
pause

