@echo off
echo Starting frontend development server...

REM Check if node_modules exists, if not, install dependencies
if not exist node_modules (
    echo Installing dependencies...
    call npm install
)

REM Start the development server
echo Starting development server...
set "VITE_API_URL=http://localhost:8000/api"
call npm run dev
