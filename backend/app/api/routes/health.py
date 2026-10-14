from datetime import datetime, timezone
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.db.database import get_db
from app.services.inference import model_inference_service

router = APIRouter(tags=["Health"])

@router.get("/health")
def get_health_status(db: Session = Depends(get_db)):
    """
    Checks backend health, database connectivity, and ML model readiness.
    """
    db_connected = False
    try:
        db.execute(text("SELECT 1"))
        db_connected = True
    except Exception:
        db_connected = False

    return {
        "status": "healthy" if db_connected else "degraded",
        "app_name": "PlantCare AI",
        "version": "1.0.0",
        "model_loaded": model_inference_service.is_loaded,
        "database_connected": db_connected,
        "supported_classes_count": len(model_inference_service.class_indices),
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
