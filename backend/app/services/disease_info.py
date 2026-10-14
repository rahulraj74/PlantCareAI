import json
import os
from typing import Dict, Any, List, Optional
from app.schemas.diagnosis import DiseaseInfoSchema

KNOWLEDGE_FILE_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "../../../data/disease_knowledge.json")
)

class DiseaseKnowledgeService:
    def __init__(self):
        self._data: Dict[str, Any] = {}
        self._lookup: Dict[str, Dict[str, Any]] = {}
        self._load()

    def _load(self):
        if os.path.exists(KNOWLEDGE_FILE_PATH):
            try:
                with open(KNOWLEDGE_FILE_PATH, "r", encoding="utf-8") as f:
                    self._data = json.load(f)
                    for item in self._data.get("diseases", []):
                        self._lookup[item["id"]] = item
            except Exception as e:
                print(f"Warning: Failed to load disease knowledge library: {e}")
        else:
            print(f"Warning: Knowledge base not found at {KNOWLEDGE_FILE_PATH}")

    def get_all(self, crop: Optional[str] = None) -> List[Dict[str, Any]]:
        diseases = self._data.get("diseases", [])
        if crop:
            return [d for d in diseases if d.get("crop", "").lower() == crop.lower()]
        return diseases

    def get_by_id(self, class_id: str) -> Optional[Dict[str, Any]]:
        return self._lookup.get(class_id)

    def get_schema_by_id(self, class_id: str) -> Optional[DiseaseInfoSchema]:
        data = self.get_by_id(class_id)
        if not data:
            return None
        return DiseaseInfoSchema(
            id=data["id"],
            display_name=data["display_name"],
            scientific_name=data.get("scientific_name"),
            crop=data["crop"],
            is_healthy=data.get("is_healthy", False),
            symptoms=data.get("symptoms", []),
            causes=data.get("causes", []),
            prevention=data.get("prevention", []),
            management=data.get("management", []),
            sources=data.get("sources", []),
            last_reviewed=data.get("last_reviewed")
        )

disease_knowledge_service = DiseaseKnowledgeService()
