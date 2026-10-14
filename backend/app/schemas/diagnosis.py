from typing import List, Optional, Any, Dict
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict

class AlternativePrediction(BaseModel):
    class_id: str
    disease_name: str
    confidence: float

class DiseaseInfoSchema(BaseModel):
    id: str
    display_name: str
    scientific_name: Optional[str] = None
    crop: str
    is_healthy: bool
    symptoms: List[str]
    causes: List[str]
    prevention: List[str]
    management: List[str]
    sources: Optional[List[str]] = []
    last_reviewed: Optional[str] = None

class PredictionResponse(BaseModel):
    diagnosis_id: int
    class_id: str
    disease_name: str
    crop: str
    is_healthy: bool
    confidence: float
    is_reliable: bool
    threshold_used: float
    uncertainty_note: Optional[str] = None
    alternatives: List[AlternativePrediction] = []
    disease_info: Optional[DiseaseInfoSchema] = None
    created_at: datetime

class DiagnosisRecordSchema(BaseModel):
    id: int
    user_id: Optional[int]
    crop: str
    class_id: str
    disease_name: str
    confidence: float
    is_healthy: bool
    is_reliable: bool
    threshold_used: float
    uncertainty_note: Optional[str]
    alternatives: List[AlternativePrediction] = []
    image_path: Optional[str]
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class HistoryResponse(BaseModel):
    total: int
    page: int
    limit: int
    items: List[DiagnosisRecordSchema]
