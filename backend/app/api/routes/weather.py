from fastapi import APIRouter, Query
from app.services.weather_service import weather_service
from app.schemas.weather import WeatherResponse

router = APIRouter(prefix="/weather", tags=["Weather"])

@router.get("", response_model=WeatherResponse)
async def get_crop_weather_advisory(location: str = Query("Salinas Valley, CA")):
    """
    Retrieves temperature, humidity, rainfall, and calculates foliar disease risk indices.
    """
    return await weather_service.get_weather(location=location)
