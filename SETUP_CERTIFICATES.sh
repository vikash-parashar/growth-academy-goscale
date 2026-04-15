#!/bin/bash

# Setup Guide for Professional Certificate System
# Run this to initialize the certificate system

echo "🎓 Gopher Lab Professional Certificate System Setup"
echo "=================================================="
echo ""

# Step 1: Add gofpdf dependency
echo "📦 Step 1: Installing gofpdf dependency..."
cd backend
go get github.com/jung-kurt/gofpdf
go mod tidy
echo "✅ gofpdf installed"
echo ""

# Step 2: Optional - Install image conversion libraries for PNG/JPEG
echo "📦 Step 2: Optional - Installing image conversion support..."
# Uncomment one of these based on your preference:
# For using imaging library (pure Go):
# go get github.com/disintegration/imaging

# For using oksvg (SVG rendering):
# go get github.com/srwiley/oksvg

echo "⏭️  Image conversion is optional - you can add later"
echo ""

# Step 3: Back to project root
cd ..
echo "📝 Step 3: Customize teacher name..."
echo "Edit: backend/cmd/server/main.go"
echo "Change: TeacherName: \"Your Name\" to TeacherName: \"Vikash Parashar\""
echo ""

echo "🚀 Step 4: Ready to build and run!"
echo ""
echo "To build backend:"
echo "  cd backend"
echo "  go build -o server ./cmd/server"
echo ""
echo "To run backend:"
echo "  ./server"
echo ""
echo "To view certificate demo:"
echo "  Visit: http://localhost:3000/certificate-demo"
echo ""
echo "✨ Certificate system is ready!"
