from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.db.database import Base

class DiagnosisScan(Base):
    __tablename__ = "diagnosis_scans"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=True, index=True)
    
    crop = Column(String(50), default="Tomato", nullable=False)
    class_id = Column(String(100), nullable=False, index=True)
    disease_name = Column(String(100), nullable=False)
    confidence = Column(Float, nullable=False)
    is_healthy = Column(Boolean, default=False, nullable=False)
    is_reliable = Column(Boolean, default=True, nullable=False)
    threshold_used = Column(Float, default=0.60, nullable=False)
    
    uncertainty_note = Column(Text, nullable=True)
    alternatives_json = Column(Text, nullable=True)  # JSON-encoded differential candidate predictions
    image_path = Column(String(255), nullable=True)   # Relative path to stored media
    model_version = Column(String(50), default="mobilenetv2_1.0.0")
    
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)

    # Relationships
    user = relationship("User", back_populates="scans")
