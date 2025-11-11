@echo off
setlocal ENABLEDELAYEDEXPANSION

REM === 切換到此批次檔所在資料夾 ===
cd /d "%~dp0"

set PORT=8000
set BIND=0.0.0.0

echo ===============================================
echo  監視器誤差時間轉換器 - 單機一鍵啟動
echo  會在本機啟動簡易網站伺服器供手機/電腦使用
echo ===============================================
echo.
echo [1] 連線網址（本機）：http://localhost:%PORT%/
echo.
echo [2] 連線網址（區網，手機同 Wi-Fi 可用）：
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /R /C:"IPv4" /C:"IPv4 位址"') do (
  set ip=%%a
  set ip=!ip: =!
  echo     http://!ip!:%PORT%/
)
echo.
echo 提示：若看不到任何 IPv4 位址，請確認電腦已連上 Wi-Fi/網路。
echo.
echo 將自動嘗試使用 Python 的 http.server 啟動本機伺服器...
echo 如果尚未安裝 Python，請先安裝 https://www.python.org/ 或以 VS Code Live Server 替代。
echo.

REM === 偵測 Python 啟動方式 ===
set PYCMD=
where py >NUL 2>&1 && set PYCMD=py -3
if not defined PYCMD (
  where python >NUL 2>&1 && set PYCMD=python
)
if not defined PYCMD (
  where python3 >NUL 2>&1 && set PYCMD=python3
)

if not defined PYCMD (
  echo [錯誤] 找不到 Python。請安裝 Python 3 後再執行本批次檔。
  echo 參考： https://www.python.org/downloads/
  pause
  exit /b 1
)

echo 使用：%PYCMD% -m http.server %PORT% --bind %BIND%
start "" "%SystemRoot%\system32\cmd.exe" /c "start "" http://localhost:%PORT%/"
%PYCMD% -m http.server %PORT% --bind %BIND%
