"""
AgriHelp Backend - Image Router
Endpoints:
  POST /api/image/upload          - Upload image file, returns {imageUrl}
  POST /api/image/analyze         - Analyze by URL
  POST /api/image/analyze-base64  - Analyze base64 image
"""
import logging
from pathlib import Path

import aiofiles
from fastapi import APIRouter, File, Form, HTTPException, Request, UploadFile

from config import get_settings
from models.schemas import (
    ImageAnalysisRequest,
    ImageAnalysisResponse,
    ImageBase64Request,
    ImageUploadResponse,
    Language,
)
from services import image_service
from utils.helpers import (
    build_image_url,
    generate_upload_path,
    sanitize_filename,
    validate_image_extension,
)

logger = logging.getLogger(__name__)
settings = get_settings()
router = APIRouter(prefix="/api/image", tags=["Image Analysis"])


@router.post("/upload", response_model=ImageUploadResponse)
async def upload_image(
    request: Request,
    image: UploadFile = File(...),
    language: Language = Form("french"),
) -> ImageUploadResponse:
    """
    Upload an image file. Returns the URL that can be used with /analyze.
    Accepts: JPEG, PNG, WebP, GIF, BMP, TIFF — max 10 MB.
    """
    filename = sanitize_filename(image.filename or "upload.jpg")

    if not validate_image_extension(filename):
        raise HTTPException(
            status_code=400,
            detail="Unsupported image format. Use JPEG, PNG, WebP, GIF, BMP, or TIFF.",
        )

    # Read and validate size
    content = await image.read()
    if len(content) > settings.max_image_size_bytes:
        raise HTTPException(
            status_code=413,
            detail=f"Image too large. Maximum size is {settings.max_image_size_mb} MB.",
        )

    # Save to disk
    dest = generate_upload_path(settings.upload_dir, filename)
    async with aiofiles.open(dest, "wb") as f:
        await f.write(content)

    # Build public URL
    base_url = str(request.base_url).rstrip("/")
    image_url = build_image_url(base_url, str(dest))

    return ImageUploadResponse(image_url=image_url)


@router.post("/analyze", response_model=ImageAnalysisResponse)
async def analyze_image(body: ImageAnalysisRequest) -> ImageAnalysisResponse:
    """
    Analyze a crop image from a URL for diseases, pests, or nutrient deficiencies.
    Returns structured detection results and treatment recommendations.
    """
    try:
        return await image_service.analyze_from_url(
            image_url=body.image_url,
            language=body.language,
            analysis_type=body.analysis_type,
        )
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc))
    except Exception as exc:
        logger.exception("Image analysis error")
        raise HTTPException(
            status_code=500,
            detail="Could not analyze image. Ensure the URL is accessible.",
        )


@router.post("/analyze-base64", response_model=ImageAnalysisResponse)
async def analyze_base64_image(body: ImageBase64Request) -> ImageAnalysisResponse:
    """
    Analyze a base64-encoded crop image.
    The `image` field may include a data URI prefix (e.g. data:image/jpeg;base64,...).
    """
    if not body.image:
        raise HTTPException(status_code=400, detail="No image data provided.")

    try:
        return await image_service.analyze_from_base64(
            b64_string=body.image,
            language=body.language,
        )
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc))
    except Exception:
        logger.exception("Base64 image analysis error")
        raise HTTPException(
            status_code=500,
            detail="Could not decode or analyze the image.",
        )
