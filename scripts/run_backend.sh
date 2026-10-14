#!/usr/bin/env bash
# PlantCare AI - Launch FastAPI Backend
set -e

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

if [ -d "venv" ]; then
    source venv/bin/activate
fi

cd "$ROOT_DIR/backend"
echo "🌱 Starting PlantCare AI Backend on http://localhost:8000..."
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
