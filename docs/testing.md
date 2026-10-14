# PlantCare AI - Testing & Quality Assurance Plan

## 1. Overview
PlantCare AI incorporates comprehensive automated tests covering the full system lifecycle:
- Backend unit and API integration tests with Pytest and HTTPX
- Machine Learning inference and image validation tests
- Frontend component and routing validation
- Authentication and authorization boundary verification

## 2. Test Suites

### Backend Unit & Integration Tests (`backend/tests/`)
1. **Health Check (`test_health.py`)**:
   - Verifies `/api/health` returns status code 200 and accurate system metadata.
2. **Authentication Flow (`test_auth.py`)**:
   - Registration with valid data.
   - Rejection of duplicate emails/usernames.
   - Login with correct vs incorrect credentials.
   - Password hashing verification (verifies bcrypt hash stored, plaintext never logged).
   - Protected route access with valid, expired, and malformed JWT tokens.
3. **Image Validation (`test_image_validation.py`)**:
   - Valid JPEG, PNG, and WebP format acceptance.
   - Magic byte content verification (rejects renamed text or executable files).
   - Rejection of oversized payloads (>10MB).
   - Graceful handling of corrupted or empty files.
4. **Disease Inference & Knowledge (`test_inference.py`, `test_diseases.py`)**:
   - Valid prediction output matches schema and confidence interval `[0.0, 1.0]`.
   - Classes strictly mapped to `class_indices.json`.
   - Low confidence / out-of-distribution leaf triggers `is_reliable = False` and uncertainty advisory.
   - Disease lookup correctly fetches vetted agronomy prevention and management rules.
5. **Scan History & Permissions (`test_history.py`)**:
   - Users can only read and delete their own scans.
   - Anonymous scans are not exposed to other users.
   - Cascade deletion removes local image files safely.
6. **PDF Generation (`test_reports.py`)**:
   - Valid PDF byte stream returned with correct MIME type `application/pdf`.

## 3. Running Automated Tests

### Backend Tests
```bash
cd backend
pytest -v
```

### Coverage Report
```bash
pytest --cov=app --cov-report=term-missing
```
