@echo off
echo Setting up the Django backend...

echo.
echo Upgrading pip...
.\venv\Scripts\python.exe -m pip install --upgrade pip

echo.
echo Installing packages...
.\venv\Scripts\pip install Django==4.2.10
.\venv\Scripts\pip install djangorestframework==3.14.0
.\venv\Scripts\pip install django-cors-headers==4.3.1
.\venv\Scripts\pip install python-dotenv==1.0.0
.\venv\Scripts\pip install PyJWT==2.8.0
.\venv\Scripts\pip install djangorestframework-simplejwt==5.3.1
.\venv\Scripts\pip install whitenoise==6.6.0
.\venv\Scripts\pip install django-filter==24.1
.\venv\Scripts\pip install Pillow==10.0.0

echo.
echo Creating migrations...
.\venv\Scripts\python.exe manage.py makemigrations users
.\venv\Scripts\python.exe manage.py makemigrations projects
.\venv\Scripts\python.exe manage.py makemigrations contact

echo.
echo Applying migrations...
.\venv\Scripts\python.exe manage.py migrate

echo.
echo Creating superuser...
echo from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.create_superuser('admin', 'admin@example.com', 'admin123') if not User.objects.filter(username='admin').exists() else print('Superuser already exists') > create_superuser.py
.\venv\Scripts\python.exe manage.py shell < create_superuser.py
del create_superuser.py

echo.
echo Initializing database...
.\venv\Scripts\python.exe manage.py init_db

echo.
echo Collecting static files...
.\venv\Scripts\python.exe manage.py collectstatic --noinput

echo.
echo Setup completed!
echo To run the server: .\venv\Scripts\python manage.py runserver
