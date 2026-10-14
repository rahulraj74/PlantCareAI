import time
import httpx
from typing import Dict, Any, List
from app.core.config import settings

class WeatherService:
    def __init__(self):
        self._cache: Dict[str, Dict[str, Any]] = {}

    def _assess_disease_risks(self, temp_c: float, humidity: int) -> List[Dict[str, str]]:
        """
        Calculates disease risk indicators using validated extension rules for tomatoes:
        - Late Blight: thrives at 15°C - 21°C with >= 85% relative humidity.
        - Early Blight: favored by warm temperatures (24°C - 30°C) with high humidity (> 75%).
        - Two-Spotted Spider Mites: thrives in hot (> 28°C), dry (< 55% humidity) conditions.
        """
        risks = []

        # 1. Late Blight
        if 15.0 <= temp_c <= 21.0 and humidity >= 85:
            risks.append({
                "disease": "Tomato Late Blight (Phytophthora infestans)",
                "risk_level": "High",
                "reason": f"High risk: Air temperature ({temp_c}°C) and persistent high humidity ({humidity}%) closely match optimal sporulation thresholds."
            })
        elif humidity >= 75 and 12.0 <= temp_c <= 24.0:
            risks.append({
                "disease": "Tomato Late Blight (Phytophthora infestans)",
                "risk_level": "Moderate",
                "reason": f"Moderate risk: Elevated humidity ({humidity}%) can accelerate fungal spread if foliage remains wet."
            })
        else:
            risks.append({
                "disease": "Tomato Late Blight (Phytophthora infestans)",
                "risk_level": "Low",
                "reason": "Current ambient climate conditions are unfavorable for late blight sporangia development."
            })

        # 2. Early Blight
        if 24.0 <= temp_c <= 30.0 and humidity >= 75:
            risks.append({
                "disease": "Tomato Early Blight (Alternaria solani)",
                "risk_level": "High",
                "reason": f"Warm temperatures ({temp_c}°C) combined with high humidity ({humidity}%) accelerate Alternaria spore germination."
            })
        elif humidity >= 65:
            risks.append({
                "disease": "Tomato Early Blight (Alternaria solani)",
                "risk_level": "Moderate",
                "reason": "Moderate humidity present. Maintain canopy airflow and ensure lower leaves are pruned."
            })
        else:
            risks.append({
                "disease": "Tomato Early Blight (Alternaria solani)",
                "risk_level": "Low",
                "reason": "Environmental moisture levels are below optimal early blight thresholds."
            })

        # 3. Two-Spotted Spider Mite
        if temp_c >= 28.0 and humidity <= 50:
            risks.append({
                "disease": "Two-Spotted Spider Mite (Tetranychus urticae)",
                "risk_level": "High",
                "reason": f"Hot ({temp_c}°C) and dry ({humidity}% humidity) climate dramatically accelerates spider mite life cycles."
            })
        elif humidity > 70:
            risks.append({
                "disease": "Two-Spotted Spider Mite (Tetranychus urticae)",
                "risk_level": "Low",
                "reason": "Spider mite populations are naturally suppressed in high-humidity microclimates."
            })
        else:
            risks.append({
                "disease": "Two-Spotted Spider Mite (Tetranychus urticae)",
                "risk_level": "Moderate",
                "reason": "Warm conditions present; scout lower leaf undersides for fine webbing."
            })

        return risks

    async def get_weather(self, location: str) -> Dict[str, Any]:
        cache_key = location.lower().strip()
        now = time.time()

        # Check Cache
        if cache_key in self._cache:
            entry = self._cache[cache_key]
            if now - entry["timestamp"] < settings.WEATHER_CACHE_TTL_SECONDS:
                return entry["data"]

        api_key = settings.OPENWEATHER_API_KEY.strip()
        
        # If external API is configured, attempt live query
        if api_key:
            try:
                async with httpx.AsyncClient(timeout=6.0) as client:
                    url = f"https://api.openweathermap.org/data/2.5/weather?q={location}&units=metric&appid={api_key}"
                    resp = await client.get(url)
                    if resp.status_code == 200:
                        data = resp.json()
                        temp_c = round(float(data["main"]["temp"]), 1)
                        humidity = int(data["main"]["humidity"])
                        rainfall = float(data.get("rain", {}).get("1h", 0.0))
                        wind = round(float(data.get("wind", {}).get("speed", 0.0)) * 3.6, 1) # m/s to km/h
                        condition = data["weather"][0]["description"].title() if data.get("weather") else "Clear"

                        result = {
                            "location": data.get("name", location),
                            "temperature_c": temp_c,
                            "temperature_f": round(temp_c * 1.8 + 32, 1),
                            "humidity": humidity,
                            "rainfall_mm": rainfall,
                            "wind_speed_kmh": wind,
                            "condition": condition,
                            "forecast_summary": f"Observed {condition.lower()} conditions at {temp_c}°C with {humidity}% relative humidity.",
                            "api_configured": True,
                            "risk_assessments": self._assess_disease_risks(temp_c, humidity)
                        }

                        # Store in cache
                        self._cache[cache_key] = {"data": result, "timestamp": now}
                        return result
            except Exception as e:
                print(f"Notice: OpenWeather API call failed ({e}), falling back to simulated observations.")

        # Robust agricultural microclimate simulation when API key is unconfigured or offline
        temp_c = 22.5
        humidity = 82
        rain = 2.0
        wind = 14.0
        condition = "Partly Cloudy with Morning Dew"

        result = {
            "location": location,
            "temperature_c": temp_c,
            "temperature_f": round(temp_c * 1.8 + 32, 1),
            "humidity": humidity,
            "rainfall_mm": rain,
            "wind_speed_kmh": wind,
            "condition": condition,
            "forecast_summary": f"Simulated agricultural microclimate for {location}. High relative humidity favors moisture-associated foliar fungi.",
            "api_configured": False,
            "risk_assessments": self._assess_disease_risks(temp_c, humidity)
        }

        self._cache[cache_key] = {"data": result, "timestamp": now}
        return result

weather_service = WeatherService()
