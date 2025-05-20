#!/bin/bash

# Exit on error
set -e

echo "🚀 Setting up Portfolio development environment..."
echo "============================================"

# Check if Python 3.8+ is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3.8+ is required but not installed. Please install it first."
    exit 1
fi

PYTHON_VERSION=$(python3 -c 'import sys; print(".".join(map(str, sys.version_info[:2])))')
MAJOR_VERSION=$(python3 -c 'import sys; print(sys.version_info.major)')
MINOR_VERSION=$(python3 -c 'import sys; print(sys.version_info.minor)')

if [ $MAJOR_VERSION -lt 3 ] || { [ $MAJOR_VERSION -eq 3 ] && [ $MINOR_VERSION -lt 8 ]; }; then
    echo "❌ Python 3.8+ is required but found $PYTHON_VERSION. Please upgrade Python."
    exit 1
else
    echo "✅ Found Python $PYTHON_VERSION"
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required but not installed. Please install it first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is required but not installed. Please install it first."
    exit 1
fi

echo "✅ Prerequisites check passed"
echo ""

# Set up backend
echo "🔧 Setting up backend..."
cd backend

# Create and activate virtual environment
echo "   Creating virtual environment..."
python3 -m venv venv

# Activate the virtual environment
echo "   Activating virtual environment..."
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Verify Python path
echo "   Verifying Python path..."
which python
python --version

# Install Python dependencies
echo "   Upgrading pip..."
python -m pip install --upgrade pip

echo "   Installing Python dependencies..."
echo "   Current directory: $(pwd)"
echo "   Python path: $(which python)"
echo "   Pip path: $(which pip)"

# Install requirements
pip install -r requirements.txt

# Verify installation
echo "   Verifying package installation..."
pip list

# Set up environment variables
if [ ! -f .env ]; then
    echo "   Creating .env file..."
    cp .env.example .env
    # Generate a random secret key
    SECRET_KEY=$(python3 -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())')
    sed -i "s/SECRET_KEY=.*/SECRET_KEY='$SECRET_KEY'/" .env
fi

# Run database migrations
echo "   Running database migrations..."
python manage.py migrate

echo "✅ Backend setup complete"
echo ""

# Set up frontend
echo "🎨 Setting up frontend..."
cd ../frontend

# Install Node.js dependencies
echo "   Installing Node.js dependencies..."
npm install

# Set up environment variables
if [ ! -f .env ]; then
    echo "   Creating .env file..."
    cp .env.example .env
fi

echo "✅ Frontend setup complete"
echo ""

# Print completion message
echo "✨ Setup complete! ✨"
echo ""
echo "To start the development servers, run:"
echo ""
echo "  # In one terminal:"
echo "  cd backend"
echo "  source venv/bin/activate  # On Windows: venv\Scripts\activate"
echo "  python manage.py runserver"
echo ""
echo "  # In another terminal:"
echo "  cd frontend"
echo "  npm run dev"
echo ""
echo "Access the application at http://localhost:5173"
echo "Access the API documentation at http://localhost:8000/api/docs/"

# Make the script executable
chmod +x "$0"
