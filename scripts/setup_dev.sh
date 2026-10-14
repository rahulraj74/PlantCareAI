#!/usr/bin/env bash
# PlantCare AI - Local Development Environment Setup Script
set -e

echo "=============================================="
echo "🌱 PlantCare AI - Development Environment Setup"
echo "=============================================="

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "1. Checking Python and Node environments..."
python3 --version
node -v
npm -v

echo "2. Setting up Python Virtual Environment..."
if [ ! -d "venv" ]; then
    python3 -m venv venv
    echo "Created virtual environment in ./venv"
else
    echo "Virtual environment ./venv already exists."
fi

# Activate virtual environment
source venv/bin/activate
pip install --upgrade pip

echo "3. Installing Backend Dependencies..."
pip install -r backend/requirements.txt

echo "4. Installing Frontend Dependencies..."
cd "$ROOT_DIR/frontend"
npm install

echo "5. Preparing environment configuration..."
cd "$ROOT_DIR"
if [ ! -f "backend/.env" ]; then
    cp backend/.env.example backend/.env
    echo "Created backend/.env from .env.example"
fi

if [ ! -f "frontend/.env" ]; then
    cp frontend/.env.example frontend/.env
    echo "Created frontend/.env from .env.example"
fi

echo "=============================================="
echo "✅ Setup Complete!"
echo "Run backend:  ./scripts/run_backend.sh"
echo "Run frontend: ./scripts/run_frontend.sh"
echo "=============================================="
