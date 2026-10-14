import os
import json
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.diagnosis import DiagnosisScan
from app.models.user import User
from app.schemas.diagnosis import DiagnosisRecordSchema, AlternativePrediction
from app.api.routes.auth import get_optional_user

router = APIRouter(prefix="/history", tags=["History"])

@router.get("")
def get_diagnosis_history(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    crop: Optional[str] = None,
    disease: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user)
):
    query = db.query(DiagnosisScan)

    # Scoped to authenticated user if logged in
    if current_user:
        query = query.filter(DiagnosisScan.user_id == current_user.id)
    else:
        # For public/demo exploration: return all scans where user_id is null or public
        pass

    if crop and crop.lower() != "all":
        query = query.filter(DiagnosisScan.crop.ilike(f"%{crop}%"))
    if disease:
        query = query.filter(DiagnosisScan.disease_name.ilike(f"%{disease}%"))

    total = query.count()
    scans = query.order_by(DiagnosisScan.created_at.desc()).offset((page - 1) * limit).limit(limit).all()

    items = []
    for s in scans:
        alternatives = []
        if s.alternatives_json:
            try:
                raw_alts = json.loads(s.alternatives_json)
                alternatives = [AlternativePrediction(**a) for a in raw_alts]
            except Exception:
                pass

        items.append({
            "id": s.id,
            "user_id": s.user_id,
            "crop": s.crop,
            "class_id": s.class_id,
            "disease_name": s.disease_name,
            "confidence": s.confidence,
            "is_healthy": s.is_healthy,
            "is_reliable": s.is_reliable,
            "threshold_used": s.threshold_used,
            "uncertainty_note": s.uncertainty_note,
            "alternatives": alternatives,
            "image_path": s.image_path,
            "created_at": s.created_at
        })

    return {
        "total": total,
        "page": page,
        "limit": limit,
        "items": items
    }

@router.delete("/{id}", status_code=status.HTTP_200_OK)
def delete_diagnosis_record(
    id: int,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user)
):
    scan = db.query(DiagnosisScan).filter(DiagnosisScan.id == id).first()
    if not scan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Diagnosis record #{id} not found."
        )

    # Access control: If scan has an owner, only owner can delete
    if scan.user_id and (not current_user or scan.user_id != current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to delete this diagnosis record."
        )

    # Delete local stored image file if exists
    if scan.image_path and os.path.exists(scan.image_path):
        try:
            os.remove(scan.image_path)
        except Exception as e:
            print(f"Notice: Failed to delete image file {scan.image_path}: {e}")

    # Remove database record
    db.delete(scan)
    db.commit()

    return {"message": f"Diagnosis record #{id} and stored assets successfully deleted."}
