@echo off
title SkillBridge AI Backend Server
echo ========================================================
echo  SkillBridge AI — Starting Flask + SQLite Backend Server
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
