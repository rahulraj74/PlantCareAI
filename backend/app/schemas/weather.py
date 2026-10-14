from typing import List, Optional
from pydantic import BaseModel

class RiskAssessmentSchema(BaseModel):
    disease: str
    risk_level: str  # Low, Moderate, High
    reason: str

class WeatherResponse(BaseModel):
    location: str
    temperature_c: float
    temperature_f: float
    humidity: int
    rainfall_mm: float
    wind_speed_kmh: float
    condition: str
    forecast_summary: str
    api_configured: bool
    risk_assessments: List[RiskAssessmentSchema] = []
