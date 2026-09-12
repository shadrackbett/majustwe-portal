@echo off
echo Starting MAJUSTWE Backend...
cd backend
call venv\Scripts\activate.bat
py manage.py runserver
pause
