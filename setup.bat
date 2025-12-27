@echo off
REM Setup script for Population Management System (Windows)

echo ==========================================
echo Population Management System - Setup
echo ==========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo X Node.js is not installed. Please install Node.js ^>= 16.x first.
    exit /b 1
)

echo √ Node.js is installed
node -v

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo X npm is not installed. Please install npm first.
    exit /b 1
)

echo √ npm is installed
npm -v

REM Check if MongoDB is installed
where mongod >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ! MongoDB is not installed or not in PATH.
    echo   Please make sure MongoDB is installed and running.
) else (
    echo √ MongoDB is installed
)

echo.
echo ==========================================
echo Installing Backend Dependencies...
echo ==========================================
cd backend
call npm install

echo.
echo ==========================================
echo Installing Frontend Dependencies...
echo ==========================================
cd ..\frontend
call npm install

echo.
echo ==========================================
echo Setup Environment Variables...
echo ==========================================
cd ..
if not exist backend\.env (
    copy backend\.env.example backend\.env
    echo √ Created backend\.env file
    echo ! Please update backend\.env with your configuration
) else (
    echo √ backend\.env already exists
)

echo.
echo ==========================================
echo Setup Complete!
echo ==========================================
echo.
echo Next steps:
echo 1. Make sure MongoDB is running
echo 2. Update backend\.env with your configuration
echo 3. Start backend: cd backend ^&^& npm run dev
echo 4. Start frontend (in new terminal): cd frontend ^&^& npm run dev
echo 5. Open browser: http://localhost:3000
echo.
echo For more information, see README.md
echo.

pause
