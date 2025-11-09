@echo off
echo  Starting SmartClassX Servers...

REM Go to script directory
cd /d "%~dp0"

echo.

REM ====== LANDING PAGE ======
if exist landing (
    echo  Starting Landing Page on port 3000...
    start "Landing Page" cmd /k "cd landing && npm run dev -- -p 3000"
) else (
    echo Landing Page folder not found!
)

echo.

REM ====== ATTENDANCE BACKEND ======
if exist attendance_hh\Backend (
    echo  Starting Attendance Backend on port 5000...
    start "Attendance Backend" cmd /k "cd attendance_hh\Backend && npm start"
) else (
    echo  Attendance Backend folder not found!
)

echo.

REM ====== ATTENDANCE FRONTEND ======
if exist attendance_hh\Frontend (
    echo  Starting Attendance Frontend on port 3001...
    start "Attendance Frontend" cmd /k "cd attendance_hh\Frontend && npm run dev -- --port 3001"
) else (
    echo Attendance Frontend folder not found!
)

echo.

REM ====== DOCUMENT PORTAL ======
if exist document (
    echo  Starting Document Portal on port 3002...
    start "Document Portal" cmd /k "cd document && npm run dev -- -p 3002"
) else (
    echo  Document Portal folder not found!
)

echo.

REM ====== RECORDED LECTURES PORTAL ======
if exist record (
    echo Starting Recorded Lectures Portal on port 3003...
    start "Recorded Lectures" cmd /k "cd record && npm run dev -- -p 3003"
) else (
    echo Recorded Lectures folder not found!
)

echo.
echo  All possible servers attempted to start!
echo If any did not open, check paths above.
pause
