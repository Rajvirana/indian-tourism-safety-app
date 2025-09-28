#!/bin/bash

# Indian Tourism & Safety Application Startup Script

echo "🇮🇳 Starting Indian Tourism & Safety Application..."
echo "=================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
    echo "✅ Dependencies installed successfully"
else
    echo "✅ Dependencies already installed"
fi

echo ""
echo "🚀 Starting the application..."
echo ""
echo "📱 Main Application: http://localhost:5000"
echo "🚔 Police Dashboard: http://localhost:5000/police"
echo ""
echo "Features Available:"
echo "• ✅ QR Code Verification (Aadhar/Passport)"
echo "• ✅ Tourism Recommendations"
echo "• ✅ Live Location Tracking"
echo "• ✅ Emergency SOS System"
echo "• ✅ Multilingual Support (12+ languages)"
echo "• ✅ Offline Mode"
echo "• ✅ Police Emergency Dashboard"
echo "• ✅ Accessibility Features"
echo ""
echo "Press Ctrl+C to stop the server"
echo "=================================================="

# Start the server
npm start
