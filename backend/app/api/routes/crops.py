from fastapi import APIRouter
from app.services.disease_info import disease_knowledge_service

router = APIRouter(prefix="/crops", tags=["Crops"])

@router.get("")
def get_supported_crops():
    """
    Returns list of supported crops and their class counts.
    """
    all_diseases = disease_knowledge_service.get_all()
    tomato_classes = [d for d in all_diseases if d.get("crop", "").lower() == "tomato"]
    
    return [
        {
            "name": "Tomato",
            "scientific_name": "Solanum lycopersicum",
            "supported_classes": len(tomato_classes),
            "status": "production",
            "description": "Full pathology detection supporting 10 distinct viral, fungal, bacterial, and pest conditions."
        },
        {
            "name": "Potato",
            "scientific_name": "Solanum tuberosum",
            "supported_classes": 3,
            "status": "planned",
            "description": "Early blight and late blight detection scheduled for v2.0."
        },
        {
            "name": "Bell Pepper",
            "scientific_name": "Capsicum annuum",
            "supported_classes": 2,
            "status": "planned",
            "description": "Bacterial spot detection scheduled for v2.0."
        }
    ]
