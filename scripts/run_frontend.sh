#!/usr/bin/env bash
# PlantCare AI - Launch Frontend Dev Server
set -e

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR/frontend"

echo "🌱 Starting PlantCare AI Frontend on Vite..."
npm run dev
