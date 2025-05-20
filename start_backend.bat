@echo off
echo Starting Django backend server...

cd backend

:: Activate virtual environment
call .\venv\Scripts\activate

:: Set environment variables
set DJANGO_SETTINGS_MODULE=pervasion.settings

:: Run the server
python manage.py runserver

pause
