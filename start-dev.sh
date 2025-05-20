#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting Portfolio development servers..."
echo "====================================="

# Function to kill processes on exit
cleanup() {
  echo "🛑 Stopping all processes..."
  # Kill all child processes
  pkill -P $$
  exit 0
}

# Set up trap to clean up on script exit
trap cleanup INT TERM EXIT

# Start backend server
echo "🔧 Starting backend server (http://localhost:8000)..."
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
python manage.py runserver &
BACKEND_PID=$!
cd ..

# Wait for backend to start
echo "   Waiting for backend to start..."
sleep 5

# Start frontend server
echo "🎨 Starting frontend server (http://localhost:5173)..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "✨ Development servers are running!"
echo ""
echo "  Frontend: http://localhost:5173"
echo "  Backend API: http://localhost:8000"
echo "  API Docs: http://localhost:8000/api/docs/"
echo "  Admin: http://localhost:8000/admin/"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Wait for all processes to complete
wait $BACKEND_PID $FRONTEND_PID
