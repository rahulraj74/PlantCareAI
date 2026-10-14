import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.db.database import init_db, SessionLocal
from app.models.user import User
from app.models.diagnosis import DiagnosisScan
from app.core.security import get_password_hash

# Routers
from app.api.routes.health import router as health_router
from app.api.routes.auth import router as auth_router
from app.api.routes.diagnosis import router as diagnosis_router
from app.api.routes.history import router as history_router
from app.api.routes.crops import router as crops_router
from app.api.routes.diseases import router as diseases_router
from app.api.routes.dashboard import router as dashboard_router
from app.api.routes.weather import router as weather_router
from app.api.routes.reports import router as reports_router
from app.api.routes.chat import router as chat_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Ensure upload directory exists and database is initialized
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    init_db()

    # Seed default user if empty
    db = SessionLocal()
    try:
        if not db.query(User).filter(User.username == "demo_farmer").first():
            demo_user = User(
                username="demo_farmer",
                email="farmer@plantcare.ai",
                hashed_password=get_password_hash("FarmerCare2026!"),
                full_name="Agronomy Research Demo",
                role="farmer",
                is_active=True
            )
            db.add(demo_user)
            db.commit()
    except Exception as e:
        print(f"Notice: Initial user seed skipped or already present: {e}")
    finally:
        db.close()

    yield
    # Shutdown logic (if any)

app = FastAPI(
    title=settings.APP_NAME,
    description="Full-stack AI-powered agricultural diagnosis, analytics, and agronomy decision support system.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan
)

# CORS Middleware
origins = settings.CORS_ORIGINS if isinstance(settings.CORS_ORIGINS, list) else ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Static Uploads Directory
if os.path.exists(settings.UPLOAD_DIR):
    app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Include Routers under /api
app.include_router(health_router, prefix="/api")
app.include_router(auth_router, prefix="/api")
app.include_router(diagnosis_router, prefix="/api")
app.include_router(history_router, prefix="/api")
app.include_router(crops_router, prefix="/api")
app.include_router(diseases_router, prefix="/api")
app.include_router(dashboard_router, prefix="/api")
app.include_router(weather_router, prefix="/api")
app.include_router(reports_router, prefix="/api")
app.include_router(chat_router, prefix="/api")

@app.get("/")
def root_redirect():
    return {
        "app": settings.APP_NAME,
        "status": "online",
        "documentation": "/docs",
        "health_endpoint": "/api/health"
    }
