#!/bin/bash

# Setup script for Population Management System

echo "=========================================="
echo "Population Management System - Setup"
echo "=========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "❌ Node.js is not installed. Please install Node.js >= 16.x first."
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check if npm is installed
if ! command -v npm &> /dev/null
then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm version: $(npm -v)"

# Check if PostgreSQL is installed
if ! command -v PostgreSQL &> /dev/null
then
    echo "⚠️  PostgreSQL is not installed or not in PATH."
    echo "   Please make sure PostgreSQL is installed and running."
else
    echo "✅ PostgreSQL is installed"
fi

echo ""
echo "=========================================="
echo "Installing Backend Dependencies..."
echo "=========================================="
cd backend
npm install

echo ""
echo "=========================================="
echo "Installing Frontend Dependencies..."
echo "=========================================="
cd ../frontend
npm install

echo ""
echo "=========================================="
echo "Setup Environment Variables..."
echo "=========================================="
cd ..
if [ ! -f backend/.env ]; then
    cp backend/.env.example backend/.env
    echo "✅ Created backend/.env file"
    echo "⚠️  Please update backend/.env with your configuration"
else
    echo "✅ backend/.env already exists"
fi

echo ""
echo "=========================================="
echo "Setup Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Make sure PostgreSQL is running: PostgreSQL"
echo "2. Update backend/.env with your configuration"
echo "3. Start backend: cd backend && npm run dev"
echo "4. Start frontend (in new terminal): cd frontend && npm run dev"
echo "5. Open browser: http://localhost:3000"
echo ""
echo "For more information, see README.md"
echo ""
