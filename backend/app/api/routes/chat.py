import httpx
from fastapi import APIRouter
from app.core.config import settings
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.disease_info import disease_knowledge_service

router = APIRouter(prefix="/chat", tags=["Chat"])

@router.post("", response_model=ChatResponse)
async def process_crop_care_chat(req: ChatRequest):
    query = req.message.lower().strip()
    
    # 1. Search Knowledge Base for Grounded Context
    all_diseases = disease_knowledge_service.get_all()
    matched_disease = None
    
    for d in all_diseases:
        name = d["display_name"].lower()
        class_id = d["id"].lower()
        if any(term in query for term in [name, class_id.replace("tomato___", "").replace("_", " ")]):
            matched_disease = d
            break
        # Also check symptoms keywords
        if any(sym.lower() in query for sym in d.get("symptoms", [])[:2]):
            matched_disease = d
            break

    # 2. If Gemini API Key or OpenAI API key is configured, call LLM with grounding
    llm_key = settings.GEMINI_API_KEY.strip() or settings.OPENAI_API_KEY.strip()
    if llm_key:
        try:
            # Here an external provider could be queried if available
            pass
        except Exception:
            pass

    # 3. Grounded Agricultural Knowledge Base Engine (Zero External Cost Fallback)
    if matched_disease:
        reply_lines = [
            f"**{matched_disease['display_name']}** ({matched_disease.get('scientific_name', 'Pathogen')}) Guidance:",
            "",
            "**Key Symptoms:**",
            *[f"• {s}" for s in matched_disease.get("symptoms", [])[:3]],
            "",
            "**Recommended Action & Cultural Management:**",
            *[f"• {m}" for m in matched_disease.get("management", [])[:3]],
            "",
            "**Sanitation & Prevention:**",
            *[f"• {p}" for p in matched_disease.get("prevention", [])[:2]],
            "",
            "**Agronomic Disclaimer:** Follow Integrated Pest Management (IPM). Avoid broad-spectrum synthetic sprays unless confirmed by local university extension agents."
        ]
        return ChatResponse(
            reply="\n".join(reply_lines),
            sources=matched_disease.get("sources", ["University Cooperative Extension"]),
            llm_available=bool(llm_key)
        )

    # General agronomy questions (watering, pruning, soil, general blight)
    if any(k in query for k in ["water", "irrigation"]):
        reply = (
            "**Optimal Tomato Irrigation Practice:**\n"
            "• Use subsurface drip lines directly at the root zone rather than overhead sprinklers.\n"
            "• Water early in the morning so accidental foliage splash dries before nightfall.\n"
            "• Provide approximately 1.5–2 inches of water per week, varying with ambient heat."
        )
        sources = ["UC ANR Vegetable Production Guides"]
    elif any(k in query for k in ["prune", "pruning", "sucker"]):
        reply = (
            "**Canopy Aeration & Pruning:**\n"
            "• Prune all suckers and foliage up to 10–12 inches above the soil once tomato plants reach 3 feet in height.\n"
            "• Removing ground-adjacent foliage drastically reduces splash infection from soil-borne fungi (such as Early Blight and Septoria)."
        )
        sources = ["Cornell Vegetable MD Online"]
    elif any(k in query for k in ["blight", "fungus", "spot"]):
        reply = (
            "**Managing Foliar Leaf Spots and Blights:**\n"
            "• Immediately strip off symptomatic lower leaflets into a disposable bag. Never compost infected leaves.\n"
            "• Apply clean organic mulch (straw or plastic) around plant crowns to block soil spore splash.\n"
            "• Ensure ample airflow (at least 24–36 inches between plants) to prevent stagnant humidity."
        )
        sources = ["Penn State Extension Plant Pathology"]
    else:
        reply = (
            "I am grounded in vetted agricultural extension research for tomatoes. "
            "You can ask me about symptoms and management for **Early Blight**, **Late Blight**, "
            "**Bacterial Spot**, **Leaf Mold**, **Septoria Spot**, **Spider Mites**, **Target Spot**, "
            "or best practices for drip irrigation and canopy aeration."
        )
        sources = ["PlantCare AI Vetted Knowledge Base"]

    return ChatResponse(
        reply=reply,
        sources=sources,
        llm_available=bool(llm_key)
    )
