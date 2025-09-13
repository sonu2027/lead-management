@echo off
echo Starting Lead Management System...
echo.

echo Installing frontend dependencies...
call npm install
if %errorlevel% neq 0 (
    echo Failed to install frontend dependencies
    pause
    exit /b 1
)

echo.
echo Installing backend dependencies...
cd server
call npm install
if %errorlevel% neq 0 (
    echo Failed to install backend dependencies
    pause
    exit /b 1
)

echo.
echo Starting backend server...
start "Backend Server" cmd /k "npm run dev"

echo.
echo Waiting for backend to start...
timeout /t 3 /nobreak > nul

echo.
echo Starting frontend development server...
cd ..
start "Frontend Server" cmd /k "npm run dev"

echo.
echo Both servers are starting up!
echo Frontend will be available at: http://localhost:5173
echo Backend API will be available at: http://localhost:5000
echo.
echo Make sure MongoDB is running on your system.
echo.
pause
