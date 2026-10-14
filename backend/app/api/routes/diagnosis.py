import os
import uuid
import json
from datetime import datetime, timezone
from typing import Optional
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.core.config import settings
from app.models.diagnosis import DiagnosisScan
from app.models.user import User
from app.schemas.diagnosis import PredictionResponse, AlternativePrediction
from app.services.image_validation import validate_uploaded_image
from app.services.inference import model_inference_service
from app.services.disease_info import disease_knowledge_service
from app.api.routes.auth import get_optional_user

router = APIRouter(prefix="/diagnosis", tags=["Diagnosis"])

@router.post("/predict", response_model=PredictionResponse)
async def predict_plant_disease(
    file: UploadFile = File(...),
    crop: str = Form("Tomato"),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user)
):
    # 1. Content & Structure Validation
    image_bytes = await validate_uploaded_image(file)

    # 2. Run Model Inference
    pred = model_inference_service.predict(image_bytes, crop=crop)

    # 3. Secure File Storage (UUID-based name to prevent path traversal)
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    ext = file.filename.split(".")[-1].lower() if file.filename and "." in file.filename else "jpg"
    safe_filename = f"{uuid.uuid4().hex}.{ext}"
    safe_filepath = os.path.join(settings.UPLOAD_DIR, safe_filename)

    try:
        with open(safe_filepath, "wb") as f:
            f.write(image_bytes)
    except Exception as e:
        safe_filepath = None

    # 4. Persist Scan in Database
    scan_record = DiagnosisScan(
        user_id=current_user.id if current_user else None,
        crop=crop,
        class_id=pred["class_id"],
        disease_name=pred["disease_name"],
        confidence=pred["confidence"],
        is_healthy=pred["is_healthy"],
        is_reliable=pred["is_reliable"],
        threshold_used=pred["threshold_used"],
        uncertainty_note=pred["uncertainty_note"],
        alternatives_json=json.dumps(pred["alternatives"]),
        image_path=safe_filepath,
        created_at=datetime.now(timezone.utc)
    )
    db.add(scan_record)
    db.commit()
    db.refresh(scan_record)

    # 5. Format and return Response
    return PredictionResponse(
        diagnosis_id=scan_record.id,
        class_id=pred["class_id"],
        disease_name=pred["disease_name"],
        crop=crop,
        is_healthy=pred["is_healthy"],
        confidence=pred["confidence"],
        is_reliable=pred["is_reliable"],
        threshold_used=pred["threshold_used"],
        uncertainty_note=pred["uncertainty_note"],
        alternatives=[AlternativePrediction(**a) for a in pred["alternatives"]],
        disease_info=pred["disease_info"],
        created_at=scan_record.created_at
    )

@router.get("/{id}")
def get_diagnosis_by_id(id: int, db: Session = Depends(get_db)):
    scan = db.query(DiagnosisScan).filter(DiagnosisScan.id == id).first()
    if not scan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Diagnosis record #{id} not found."
        )

    # Parse alternatives
    alternatives = []
    if scan.alternatives_json:
        try:
            raw_alts = json.loads(scan.alternatives_json)
            alternatives = [AlternativePrediction(**a) for a in raw_alts]
        except Exception:
            pass

    # Attach vetted knowledge
    disease_info = disease_knowledge_service.get_schema_by_id(scan.class_id)

    return {
        "diagnosis_id": scan.id,
        "id": scan.id,
        "class_id": scan.class_id,
        "disease_name": scan.disease_name,
        "crop": scan.crop,
        "is_healthy": scan.is_healthy,
        "confidence": scan.confidence,
        "is_reliable": scan.is_reliable,
        "threshold_used": scan.threshold_used,
        "uncertainty_note": scan.uncertainty_note,
        "alternatives": alternatives,
        "disease_info": disease_info,
        "created_at": scan.created_at.isoformat() if scan.created_at else None
    }
