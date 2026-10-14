# PlantCare AI — College Project Demonstration & Viva Checklist

This document provides a guided step-by-step demonstration walkthrough for college evaluators, project guides, and examiners.

---

## 📋 Pre-Demonstration Verification

- [ ] Node.js and Vite dev server running on `http://localhost:5173`.
- [ ] Backend accessible on `http://localhost:8000` (or local simulation fallback active).
- [ ] Browser window open to `http://localhost:5173` (e.g. Brave, Chrome, or Safari).
- [ ] Database `plantcare.db` or in-memory SQLite ready.

---

## 🎬 Live Demonstration Script (10-Minute Walkthrough)

### Step 1: System Overview & Homepage (`/`)
- [ ] **Action**: Navigate to `http://localhost:5173/`.
- [ ] **Demonstration Talking Points**:
  - Point out the clean, modern agricultural UI designed specifically for farmers and agronomy students.
  - Highlight the 3-step workflow (Capture $\rightarrow$ MobileNetV2 Inference $\rightarrow$ Prescriptive Action).
  - Show the **Explicit Academic Limitations** card, demonstrating engineering integrity (clarifying that AI supports, rather than replaces, extension laboratory testing).

### Step 2: Live Leaf Disease Detection (`/detect`)
- [ ] **Action**: Click the **Detect Disease** button in the header.
- [ ] **Demonstration Talking Points**:
  - Highlight the **Target Crop** selector (Tomato with 10 supported classes).
  - Show the dynamic **Reliability Threshold** slider (default 60%).
  - Click on the quick sample: **Tomato Early Blight (Sample)**.
  - Click **Analyze Leaf Health**.
  - Show the live diagnosis card:
    - Primary diagnosis: *Tomato Early Blight*.
    - **Diagnostic Confidence Meter**: visual percentage bar with color-coded reliability badge.
    - **Differential Diagnoses (Alternative Candidates)**: shows secondary possibilities evaluated by the neural network (e.g., Target Spot, Septoria Spot).
    - **Agronomy Knowledge Base Tabs**: switch between *Action & Management*, *Typical Symptoms*, *Pathogen & Causes*, and *Prevention Practices*.
    - **Extension Citations**: show authentic university sources (Cornell, Penn State).

### Step 3: Low-Confidence & Uncertainty Handling
- [ ] **Action**: Adjust the threshold slider to 95% and re-analyze or describe the threshold behavior.
- [ ] **Demonstration Talking Points**:
  - Explain how PlantCare AI protects farmers against hallucinations: when an ambiguous or blurry leaf scores below the cutoff, an **Uncertainty Advisory Notice** warns the user and recommends re-shooting or consulting an extension agent.

### Step 4: Exporting PDF Diagnostic Report
- [ ] **Action**: Click **View Full Diagnosis File** or **Export PDF Report**.
- [ ] **Demonstration Talking Points**:
  - Show the generated ReportLab document containing diagnosis ID, crop, confidence score, full symptoms manifest, cultural controls, and the educational disclaimer.

### Step 5: Farm Analytics Dashboard (`/dashboard`)
- [ ] **Action**: Navigate to `/dashboard`.
- [ ] **Demonstration Talking Points**:
  - Show KPI metric cards: Total Diagnoses, Healthy Predictions, Pathologies Detected, Model High Reliability rate.
  - Showcase interactive **Recharts**:
    - **Diagnosis Volume Trends** (Area Chart).
    - **Crop Health Breakdown** (Pie Chart showing disease frequency distribution).
  - Review the **Recent Plant Diagnoses** audit table.

### Step 6: Disease Knowledge Library (`/library`)
- [ ] **Action**: Navigate to `/library`.
- [ ] **Demonstration Talking Points**:
  - Showcase the 10 supported PlantVillage tomato classes.
  - Demonstrate search filter (type "blight", "yellow", or "curl").
  - Click on a disease card to open the interactive clinical modal factsheet.

### Step 7: Weather-Aware Microclimate Risk Forecasting (`/weather`)
- [ ] **Action**: Navigate to `/weather`.
- [ ] **Demonstration Talking Points**:
  - Enter a farm location (e.g., "Salinas Valley, CA" or your local city).
  - Point out temperature, humidity, and rainfall indicators.
  - Review the **Pathogen Microclimate Risk Matrix**: explain how temperature and humidity correlate to biological spore germination (e.g. Late Blight thrives at 15–21°C with >85% humidity).

### Step 8: Crop Care & Cultural Practices (`/crop-care`)
- [ ] **Action**: Navigate to `/crop-care`.
- [ ] **Demonstration Talking Points**:
  - Review the 4 pillars of tomato cultural health: Precision Irrigation, Canopy Aeration, Heavy Mulching, and Integrated Pest Management (IPM).

### Step 9: Grounded Agricultural Assistant Chatbot
- [ ] **Action**: Click the floating **Ask Crop Assistant** button at bottom right.
- [ ] **Demonstration Talking Points**:
  - Click one of the quick chips: *"How to prevent early blight?"*.
  - Show the immediate grounded response citing extension research without requiring paid API keys.

### Step 10: Code Architecture & Backend Tests
- [ ] **Action**: Open terminal or show project structure in IDE.
- [ ] **Demonstration Talking Points**:
  - Show clean separation: `frontend/`, `backend/`, `ml/`, `data/`, `docs/`.
  - Point out the comprehensive automated test suite in `backend/tests/` covering health, auth, image validation, inference, and report generation.
