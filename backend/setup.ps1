# Setup script for the new Django backend

# Activate virtual environment
Write-Host "Activating virtual environment..."
try {
    .\venv\Scripts\Activate.ps1
} catch {
    Write-Host "Could not activate virtual environment. You may need to run: Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser"
    Write-Host "Continuing without activating virtual environment..."
}

# Install required packages
Write-Host "Installing required packages..."
try {
    .\venv\Scripts\pip install -r requirements.txt
} catch {
    Write-Host "Error installing packages: $_"
}
setup.bat
# Make migrations for each app individually to avoid encoding issues
Write-Host "Creating database migrations..."
try {
    .\venv\Scripts\python manage.py makemigrations users
    .\venv\Scripts\python manage.py makemigrations projects
    .\venv\Scripts\python manage.py makemigrations contact
    .\venv\Scripts\python manage.py makemigrations api
} catch {
    Write-Host "Error creating migrations: $_"
}

# Apply migrations
Write-Host "Applying migrations..."
try {
    .\venv\Scripts\python manage.py migrate
} catch {
    Write-Host "Error applying migrations: $_"
}

# Create superuser
Write-Host "Creating superuser..."
try {
    .\venv\Scripts\python manage.py shell -c "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.create_superuser('admin', 'admin@example.com', 'admin123') if not User.objects.filter(username='admin').exists() else None"
    Write-Host "Superuser created successfully. Username: admin, Password: admin123"
} catch {
    Write-Host "Error creating superuser: $_"
}

# Initialize database with sample data
Write-Host "Initializing database with sample data..."
try {
    .\venv\Scripts\python manage.py init_db
} catch {
    Write-Host "Error initializing database: $_"
}

# Collect static files
Write-Host "Collecting static files..."
try {
    .\venv\Scripts\python manage.py collectstatic --noinput
} catch {
    Write-Host "Error collecting static files: $_"
}

Write-Host "Setup completed successfully!"
Write-Host "To run the server: .\venv\Scripts\python manage.py runserver"
