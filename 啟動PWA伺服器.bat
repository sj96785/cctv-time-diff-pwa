@echo off
setlocal ENABLEDELAYEDEXPANSION
cd /d "%~dp0"
set PORT=8000
set BIND=0.0.0.0
echo 啟動本機伺服器：http://localhost:%PORT%/
where py >NUL 2>&1 && set PYCMD=py -3
if not defined PYCMD where python >NUL 2>&1 && set PYCMD=python
if not defined PYCMD where python3 >NUL 2>&1 && set PYCMD=python3
if not defined PYCMD (echo 找不到 Python，請安裝後再試 & pause & exit /b 1)
start "" "%SystemRoot%\system32\cmd.exe" /c "start "" http://localhost:%PORT%/"
%PYCMD% -m http.server %PORT% --bind %BIND%
