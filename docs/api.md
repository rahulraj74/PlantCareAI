# PlantCare AI - API Documentation

Base URL: `http://localhost:8000/api`
Interactive Swagger Documentation: `http://localhost:8000/docs`

---

## 1. System Health
### `GET /api/health`
Checks backend service availability and ML model readiness.
- **Response `200 OK`**:
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "model_loaded": true,
  "database_connected": true,
  "timestamp": "2026-10-14T12:00:00Z"
}
```

---

## 2. Authentication
### `POST /api/auth/register`
Creates a new user account.
- **Request Body**:
```json
{
  "email": "farmer@example.com",
  "username": "farmer_joe",
  "password": "StrongPassword123!"
}
```
- **Response `201 Created`**:
```json
{
  "id": 1,
  "email": "farmer@example.com",
  "username": "farmer_joe",
  "created_at": "2026-10-14T12:00:00Z"
}
```

### `POST /api/auth/login`
Authenticates user and issues JWT bearer token.
- **Request Body** (`application/x-www-form-urlencoded` or JSON):
```json
{
  "username": "farmer@example.com",
  "password": "StrongPassword123!"
}
```
- **Response `200 OK`**:
```json
{
  "access_token": "eyJhbGciOi...",
  "token_type": "bearer",
  "expires_in": 86400
}
```

### `GET /api/auth/me`
Retrieves profile of the currently authenticated user.
- **Header**: `Authorization: Bearer <TOKEN>`
- **Response `200 OK`**: User profile object.

---

## 3. Disease Diagnosis & Image Analysis
### `POST /api/diagnosis/predict`
Uploads a crop leaf image for disease classification.
- **Request**: `multipart/form-data` with field `file` (JPEG, PNG, WebP; max 10MB).
- **Optional Header**: `Authorization: Bearer <TOKEN>` (associates scan with user account if logged in).
- **Response `200 OK`**:
```json
{
  "diagnosis_id": 42,
  "class_id": "Tomato___Early_blight",
  "disease_name": "Tomato Early Blight",
  "crop": "Tomato",
  "is_healthy": false,
  "confidence": 0.942,
  "is_reliable": true,
  "threshold_used": 0.60,
  "uncertainty_note": null,
  "alternatives": [
    {"class_id": "Tomato___Target_Spot", "disease_name": "Tomato Target Spot", "confidence": 0.038},
    {"class_id": "Tomato___Septoria_leaf_spot", "disease_name": "Tomato Septoria Leaf Spot", "confidence": 0.012}
  ],
  "disease_info": {
    "scientific_name": "Alternaria solani",
    "symptoms": ["Concentric circular rings on foliage..."],
    "causes": ["Fungal pathogen Alternaria solani..."],
    "prevention": ["Mulch under plants...", "Crop rotation..."],
    "management": ["Remove lower leaves...", "Consult extension..."],
    "sources": ["Cornell University Vegetable MD Online"]
  },
  "created_at": "2026-10-14T12:05:00Z"
}
```

### `GET /api/diagnosis/{id}`
Fetches a single diagnosis record by its ID.

---

## 4. History & Analytics
### `GET /api/history`
Retrieves past diagnoses for the authenticated user with filtering and pagination.
- **Query Params**: `page=1&limit=10&crop=Tomato&disease=Early_blight`
- **Response `200 OK`**: Paginated list of diagnosis records.

### `DELETE /api/history/{id}`
Deletes a scan record and removes any stored image from storage.

### `GET /api/dashboard/stats`
Returns aggregated analytics (total scans, healthy vs infected ratio, top diseases detected).

---

## 5. Knowledge Library & Crops
### `GET /api/crops`
Returns list of supported crops and their class counts.

### `GET /api/diseases`
Returns the complete vetted disease catalog.

### `GET /api/diseases/{id}`
Retrieves detailed profile for a specific disease identifier.

---

## 6. Weather & Environmental Risk
### `GET /api/weather?location=Sacramento`
Retrieves current weather, temperature, humidity, and disease risk assessment.

---

## 7. PDF Reports
### `GET /api/reports/{diagnosis_id}/pdf`
Generates and downloads a clean, printable PDF diagnostic report.
