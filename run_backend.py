import os
import sys
import subprocess

# Add the backend directory to the Python path
backend_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'backend')
os.chdir(backend_dir)
sys.path.insert(0, backend_dir)

# Set Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'pervasion.settings')

# Run the Django server
venv_python = os.path.join(backend_dir, 'venv', 'Scripts', 'python.exe')
subprocess.run([venv_python, 'manage.py', 'runserver'])
