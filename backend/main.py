"""
AgriHelp Backend - FastAPI Application Entry Point

Run in development:
    uvicorn main:app --reload --port 3000

Run in production:
    uvicorn main:app --host 0.0.0.0 --port 3000 --workers 4
"""
import logging
import os
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from config import get_settings
from routers import auth, image, llm

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger("agrihelpapp")

settings = get_settings()


# ---------------------------------------------------------------------------
# Lifespan — startup / shutdown tasks
# ---------------------------------------------------------------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup: ensure the upload directory exists."""
    upload_path = Path(settings.upload_dir)
    upload_path.mkdir(parents=True, exist_ok=True)
    logger.info("AgriHelp API starting on port %s", settings.port)
    logger.info("Upload directory: %s", upload_path.resolve())
    logger.info("CORS allowed origins: %s", settings.cors_origins)
    yield
    logger.info("AgriHelp API shutting down.")


# ---------------------------------------------------------------------------
# FastAPI Application
# ---------------------------------------------------------------------------
app = FastAPI(
    title="AgriHelp API",
    description=(
        "Agricultural AI assistant backend for Moroccan farmers. "
        "Supports multilingual chat (Darija / French / Arabic) and crop disease detection."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# ---------------------------------------------------------------------------
# CORS Middleware
# ---------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Routers
# ---------------------------------------------------------------------------
app.include_router(llm.router)
app.include_router(image.router)
app.include_router(auth.router)

# ---------------------------------------------------------------------------
# Static files — serve uploaded images
# ---------------------------------------------------------------------------
upload_dir = Path(settings.upload_dir)
upload_dir.mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=str(upload_dir)), name="uploads")


# ---------------------------------------------------------------------------
# Health Check
# ---------------------------------------------------------------------------
@app.get("/health", tags=["Health"])
async def health_check():
    """Returns the API health status and configuration summary."""
    return {
        "status": "ok",
        "version": "1.0.0",
        "services": {
            "gemini": bool(settings.gemini_api_key),
            "supabase": bool(settings.supabase_url and settings.supabase_anon_key),
        },
    }


@app.get("/", tags=["Health"])
async def root():
    return {
        "message": "AgriHelp API is running. Visit /docs for the interactive API reference."
    }


# ---------------------------------------------------------------------------
# Dev entry point
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug,
        log_level="info",
    )
