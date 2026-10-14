from sqlalchemy import Column, Integer, String, Boolean, Text
from app.db.database import Base

class DiseaseRecord(Base):
    __tablename__ = "diseases"

    id = Column(Integer, primary_key=True, index=True)
    class_id = Column(String(100), unique=True, index=True, nullable=False)
    display_name = Column(String(100), nullable=False)
    scientific_name = Column(String(150), nullable=True)
    crop = Column(String(50), default="Tomato", nullable=False, index=True)
    is_healthy = Column(Boolean, default=False)
    
    symptoms_json = Column(Text, nullable=False)
    causes_json = Column(Text, nullable=False)
    prevention_json = Column(Text, nullable=False)
    management_json = Column(Text, nullable=False)
    sources_json = Column(Text, nullable=True)
    last_reviewed = Column(String(50), nullable=True)
