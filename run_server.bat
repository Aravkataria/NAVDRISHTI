@echo off
title ARGUS Backend Server
echo ========================================================
echo  ARGUS — Starting Flask + SQLite Backend Server
echo ========================================================
echo.
echo Server running at http://127.0.0.1:5000
echo.
python server.py
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Trying Anaconda Python...
    "C:\Users\LENOVO\anaconda3\python.exe" server.py
)
pause
