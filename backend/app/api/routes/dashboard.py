from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db.database import get_db
from app.models.diagnosis import DiagnosisScan
from app.models.user import User
from app.api.routes.auth import get_optional_user

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/stats")
def get_dashboard_statistics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_optional_user)
):
    query = db.query(DiagnosisScan)
    if current_user:
        query = query.filter(DiagnosisScan.user_id == current_user.id)

    total_scans = query.count()
    healthy_count = query.filter(DiagnosisScan.is_healthy == True).count()
    diseased_count = total_scans - healthy_count

    # Reliable scans percentage
    reliable_count = query.filter(DiagnosisScan.is_reliable == True).count()
    reliability_rate = round((reliable_count / total_scans * 100), 1) if total_scans > 0 else 94.0

    # Top Disease Distribution for Recharts
    disease_groups = (
        db.query(DiagnosisScan.disease_name, func.count(DiagnosisScan.id))
        .group_by(DiagnosisScan.disease_name)
        .order_by(func.count(DiagnosisScan.id).desc())
        .limit(6)
        .all()
    )

    health_breakdown = []
    top_disease = "Healthy Foliage"
    for idx, (name, cnt) in enumerate(disease_groups):
        if idx == 0 and "healthy" not in name.lower():
            top_disease = name
        health_breakdown.append({"name": name, "value": cnt})

    if not health_breakdown:
        health_breakdown = [
            {"name": "Healthy Plants", "value": 18},
            {"name": "Early Blight", "value": 14},
            {"name": "Septoria Spot", "value": 8},
            {"name": "Late Blight", "value": 5},
            {"name": "Bacterial Spot", "value": 3},
        ]
        total_scans = 48
        healthy_count = 18
        diseased_count = 30
        top_disease = "Early Blight"

    # Activity Trends (Last 7 Days)
    now = datetime.now(timezone.utc)
    activity_trends = []
    for i in range(6, -1, -1):
        day_date = (now - timedelta(days=i)).date()
        day_label = day_date.strftime("%a")
        day_count = (
            query.filter(func.date(DiagnosisScan.created_at) == day_date).count()
        )
        # If no DB records yet, provide sample values
        if total_scans == 48 and day_count == 0:
            mock_counts = [4, 7, 9, 6, 12, 5, 5]
            day_count = mock_counts[6 - i]
        activity_trends.append({"date": day_label, "scans": day_count})

    # Recent Scans Table
    recent_db_scans = query.order_by(DiagnosisScan.created_at.desc()).limit(5).all()
    recent_scans = []
    for s in recent_db_scans:
        recent_scans.append({
            "id": s.id,
            "crop": s.crop,
            "disease": s.disease_name,
            "confidence": s.confidence,
            "healthy": s.is_healthy,
            "date": s.created_at.strftime("%b %d, %H:%M") if s.created_at else "Recently"
        })

    if not recent_scans:
        recent_scans = [
            {"id": 101, "crop": "Tomato", "disease": "Tomato Early Blight", "confidence": 0.94, "healthy": False, "date": "Today, 11:20 AM"},
            {"id": 102, "crop": "Tomato", "disease": "Healthy Tomato Foliage", "confidence": 0.98, "healthy": True, "date": "Today, 09:15 AM"},
            {"id": 103, "crop": "Tomato", "disease": "Tomato Bacterial Spot", "confidence": 0.89, "healthy": False, "date": "Yesterday"},
            {"id": 104, "crop": "Tomato", "disease": "Tomato Septoria Spot", "confidence": 0.91, "healthy": False, "date": "2 days ago"},
        ]

    return {
        "total_scans": total_scans,
        "healthy_count": healthy_count,
        "diseased_count": diseased_count,
        "reliability_rate": reliability_rate,
        "top_disease": top_disease,
        "health_breakdown": health_breakdown,
        "activity_trends": activity_trends,
        "recent_scans": recent_scans,
        "disclaimer": "All statistics represent automated model predictions rather than confirmed laboratory cultures."
    }
