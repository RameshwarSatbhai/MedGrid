#!/bin/bash

echo "🏥 Starting MedGrid Hospital Bed Tracking System..."

# Check if MongoDB is running (for local development)
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running. Please start MongoDB first."
    echo "   On Ubuntu/Debian: sudo systemctl start mongod"
    echo "   On macOS with Homebrew: brew services start mongodb-community"
    echo "   Or use MongoDB Atlas for cloud database"
fi

# Navigate to backend directory
cd backend

echo "📦 Installing backend dependencies..."
npm install

echo "🗄️  Initializing database with demo data..."
node utils/initDatabase.js

echo "🚀 Starting backend server..."
npm run dev &
BACKEND_PID=$!

# Wait for backend to start
sleep 5

# Navigate to frontend directory
cd ../frontend/medgrid-frontend

echo "📦 Installing frontend dependencies..."
pnpm install

echo "🌐 Starting frontend development server..."
pnpm run dev --host &
FRONTEND_PID=$!

echo ""
echo "✅ MedGrid is starting up!"
echo ""
echo "🔗 Access URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:5000"
echo "   API Health: http://localhost:5000/api/health"
echo ""
echo "🔐 Demo Login Credentials:"
echo "   Admin: admin / admin123"
echo "   Doctor: doctor / doctor123"
echo "   Nurse: nurse / nurse123"
echo "   Staff: staff / staff123"
echo ""
echo "📝 To stop the servers:"
echo "   Press Ctrl+C or run: kill $BACKEND_PID $FRONTEND_PID"
echo ""

# Wait for user to stop
wait

