@echo off
echo %~dp0
echo %computername%
python -m http.server
pause