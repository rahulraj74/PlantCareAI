from typing import Optional, List
from fastapi import APIRouter, HTTPException, Query, status
from app.services.disease_info import disease_knowledge_service

router = APIRouter(prefix="/diseases", tags=["Diseases"])

@router.get("")
def list_diseases(crop: Optional[str] = Query(None)):
    """
    Returns verified plant disease knowledge base catalog.
    """
    return disease_knowledge_service.get_all(crop=crop)

@router.get("/{id}")
def get_disease_detail(id: str):
    """
    Fetches full clinical disease factsheet by class identifier.
    """
    detail = disease_knowledge_service.get_by_id(id)
    if not detail:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Disease record '{id}' not found in knowledge base."
        )
    return detail
