# 🌱 PlantCare AI - Advanced Agricultural Crop Health & Disease Diagnostic Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg?logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/Frontend-React_19_Vite-61DAFB.svg?logo=react)](https://react.dev)
[![TensorFlow](https://img.shields.io/badge/AI-MobileNetV2-FF6F00.svg?logo=tensorflow)](https://tensorflow.org)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind_CSS_v3-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com)

**PlantCare AI** is a college-level major engineering project engineered to empower farmers, extension workers, and agricultural students with instant, reliable plant disease detection and agronomic decision support. By combining deep transfer learning (MobileNetV2 on the PlantVillage dataset) with a fast, modern web platform, users can diagnose leaf pathologies, evaluate weather-associated infection risks, consult a structured agronomy knowledge base, track historical scans, and export comprehensive diagnosis PDF reports.

---

## 📸 Key Capabilities

1. **AI Leaf Pathogen Detection**:
   - High-precision classification using MobileNetV2 transfer learning on tomato leaf diseases.
   - Rigorous image validation (content magic byte inspection, dimension and size boundaries).
   - Model confidence scoring, alternative differential diagnoses, and explicit uncertainty detection (alerts when leaf imagery is ambiguous or out-of-distribution).

2. **Agronomy Disease & Crop-Care Library**:
   - Structured knowledge profiles for all supported disease classes (symptoms, biological causes, preventative cultural practices, management options).
   - Grounded exclusively in vetted agricultural extension research (Penn State Extension, Cornell Vegetable MD, UC IPM, University of Florida IFAS).

3. **Secure User Authentication & Scan History**:
   - JWT-based authentication with bcrypt password encryption.
   - User-isolated diagnosis history with filtering by crop, disease, and date.
   - Complete data ownership with the ability to delete past scans and remove stored images.

4. **Agricultural Analytics Dashboard**:
   - Real database-driven metrics: total scan volume, healthy-to-diseased ratio, disease frequency distribution, and temporal scan trends rendered via interactive Recharts.

5. **Weather-Aware Disease Advisory**:
   - Real-time weather monitoring with temperature, humidity, and rainfall conditions.
   - Rule-based agronomic risk indicators (e.g. assessing warm, humid microclimates favorable to blight pathogens).

6. **Instant Downloadable PDF Reports**:
   - Formatted diagnostic records with diagnosis ID, timestamp, confidence breakdown, symptoms, and actionable management measures generated via ReportLab.

7. **Agricultural Assistant**:
   - Grounded crop-care guidance responding to farmer queries regarding symptoms and management strategies.

---

## 🏗️ Repository Architecture

```text
PlantcareAI/
├── frontend/                     # React + Vite Single Page Application
│   ├── public/                   # Static assets & favicon
│   ├── src/
│   │   ├── assets/               # Branding graphics & imagery
│   │   ├── components/           # Reusable UI components
│   │   │   ├── layout/           # Navbar, Sidebar, Footer, PageWrapper
│   │   │   ├── common/           # Buttons, Badges, Modals, Loaders
│   │   │   ├── dashboard/        # Stat cards, quick action tiles
│   │   │   ├── upload/           # Drag-and-drop leaf uploader, image preview
│   │   │   ├── diagnosis/        # Result cards, confidence meters, alternatives
│   │   │   ├── charts/           # Disease breakdown, scan trends (Recharts)
│   │   │   └── chat/             # Crop advisor chat widget
│   │   ├── pages/                # Route views (Home, Detect, History, Library, etc.)
│   │   ├── services/             # Axios/fetch API and auth managers
│   │   ├── hooks/                # Custom React hooks
│   │   ├── utils/                # Date and metric formatters
│   │   ├── App.jsx               # Router & AuthProvider configuration
│   │   ├── index.css             # Tailwind base & custom design tokens
│   │   └── main.jsx              # Vite entry point
│   ├── package.json
│   ├── tailwind.config.js
│   └── .env.example
│
├── backend/                      # FastAPI Python Application
│   ├── app/
│   │   ├── main.py               # Application factory & router registration
│   │   ├── core/                 # App configuration & JWT security
│   │   ├── api/routes/           # Modular endpoints (auth, diagnosis, history, etc.)
│   │   ├── schemas/              # Pydantic v2 validation models
│   │   ├── models/               # SQLAlchemy database entities
│   │   ├── services/             # Inference, validation, weather, and PDF services
│   │   └── db/                   # Database session and repositories
│   ├── tests/                    # Automated Pytest suite
│   ├── requirements.txt          # Python dependencies
│   └── .env.example
│
├── ml/                           # Machine Learning Pipeline
│   ├── src/                      # Data prep, training, evaluation, inference scripts
│   ├── notebooks/                # Exploratory analysis notebooks
│   ├── artifacts/                # Model weights, class indices, metric reports
│   ├── requirements.txt
│   └── README.md
│
├── data/                         # Knowledge Base & Image Samples
│   ├── disease_knowledge.json    # Vetted agronomy factsheets
│   └── sample_images/            # Test leaf fixtures
│
├── docs/                         # Technical Documentation
│   ├── architecture.md           # System design & component interaction
│   ├── api.md                    # REST endpoint reference
│   └── testing.md                # Quality assurance & test specifications
│
├── scripts/                      # Automation & Helper Scripts
│   ├── setup_dev.sh              # One-click environment installer
│   ├── run_backend.sh            # FastAPI server runner
│   └── run_frontend.sh           # Vite dev server runner
│
├── .gitignore                    # Comprehensive ignore rules
└── README.md                     # Project documentation
```

---

## 🚀 Beginner-Friendly Setup Guide (macOS)

### Prerequisites
- **Python 3.10+** (Tested on Python 3.12 / 3.14 on macOS Apple Silicon)
- **Node.js v20+** and **npm**
- **Git**

### Step 1: Clone or Open the Workspace
```bash
cd /Users/rahulraj/Desktop/PlantcareAI
```

### Step 2: Configure Environment Files
Default `.env` configuration files have been prepared with safe local defaults:
```bash
# Frontend
cp frontend/.env.example frontend/.env

# Backend
cp backend/.env.example backend/.env
```

### Step 3: Run the Automated Setup Script
Run the automated bootstrap script:
```bash
chmod +x scripts/*.sh
./scripts/setup_dev.sh
```

Or execute manually if preferred:
```bash
# Set up Python virtual environment
python3 -m venv venv
source venv/bin/activate
pip install -r backend/requirements.txt

# Set up Frontend
cd frontend
npm install
cd ..
```

---

## 🏃 Running the Application

### 1. Launch the Backend API (FastAPI)
```bash
# Terminal 1:
source venv/bin/activate
cd backend
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
- API Base: `http://localhost:8000`
- Interactive OpenAPI / Swagger UI: `http://localhost:8000/docs`
- Health check: `http://localhost:8000/api/health`

### 2. Launch the Frontend (React + Vite)
```bash
# Terminal 2:
cd frontend
npm run dev
```
- Web Application: `http://localhost:5173`

---

## 🧪 Running Automated Tests
```bash
# Activate virtual environment
source venv/bin/activate
cd backend
pytest -v
```

---

## 🗺️ Project Implementation Roadmap

| Phase | Description | Status |
|---|---|---|
| **Phase 1** | Environment inspection, directory architecture, configuration, and documentation | ✅ **Complete** |
| **Phase 2** | Frontend design system, responsive UI components, and complete page layouts | ⏳ Next |
| **Phase 3** | FastAPI backend setup, database models, schemas, and health endpoints | ⏳ Queued |
| **Phase 4** | Machine Learning model training, evaluation pipeline, and MobileNetV2 weights | ⏳ Queued |
| **Phase 5** | End-to-end image upload, backend validation, and real model inference | ⏳ Queued |
| **Phase 6** | Structured disease knowledge catalog and crop-care advice integration | ⏳ Queued |
| **Phase 7** | User authentication, JWT security, and personal diagnosis scan history | ⏳ Queued |
| **Phase 8** | Interactive analytics charts (Recharts) and downloadable PDF reports | ⏳ Queued |
| **Phase 9** | Weather integration and environmental disease risk advisory | ⏳ Queued |
| **Phase 10** | Crop-care AI advisor assistant module | ⏳ Queued |
| **Phase 11** | Full integration testing, bug fixes, deployment preparation, and college project report | ⏳ Queued |
