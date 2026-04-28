@echo off



REM بيبليو DZ -  Start Script



REM  Setup and run the project

echo.

echo   DZ -Quick Start

echo.

REM Check if MySQL is available
mysql --version >nul 2>&1
if errorlevel 1 (
    echo  MySQL not found in PATH
    echo.
    echo Please ensure MySQL is installed and added to PATH
    echo Then run: mysql -u root -p^&lt; database.sql
    pause
    exit /b 1
)

echo  MySQL found
echo.

REM Prompt for MySQL password

set /p MYSQL_PASS="Enter MySQL password (press Enter if none): "

REM Run database script
echo.

echo Running database setup...
echo.

if "%MYSQL_PASS%"=="" (

    mysql -u root < database.sql
) else (

    mysql -u root -p%MYSQL_PASS% < database.sql
)

if errorlevel 1 (

    
    
    echo  Database setup failed
   
    pause
    exit /b 1

)

echo.
echo  Database setup complete!
echo.

REM Start backend server
echo Starting backend server...
echo.

cd backend


REM Check if node_modules exists
if not exist node_modules (
    echo Installing dependencies...
    call npm install
)

echo.
echo 🚀 Starting server on http://localhost:5001
echo.

call npm start

pause
