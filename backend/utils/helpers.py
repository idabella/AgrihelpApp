"""
AgriHelp Backend - Shared Utility Helpers
"""
import base64
import logging
import os
import uuid
from pathlib import Path
from typing import Optional

logger = logging.getLogger(__name__)


def generate_upload_path(upload_dir: str, filename: str) -> Path:
    """
    Generate a unique, safe file path for an uploaded image.
    Creates the upload directory if it doesn't exist.
    """
    upload_path = Path(upload_dir)
    upload_path.mkdir(parents=True, exist_ok=True)

    ext = Path(filename).suffix.lower() or ".jpg"
    unique_name = f"{uuid.uuid4().hex}{ext}"
    return upload_path / unique_name


def file_to_base64(file_path: str) -> str:
    """Read a file and return its base64-encoded string."""
    with open(file_path, "rb") as f:
        return base64.b64encode(f.read()).decode("utf-8")


def validate_image_extension(filename: str) -> bool:
    """Return True if the file extension is an accepted image format."""
    allowed = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".bmp", ".tiff"}
    ext = Path(filename).suffix.lower()
    return ext in allowed


def sanitize_filename(filename: str) -> str:
    """Strip directory traversal characters from a filename."""
    return Path(filename).name


def build_image_url(base_url: str, file_path: str) -> str:
    """Build a public URL for an uploaded image."""
    filename = Path(file_path).name
    base_url = base_url.rstrip("/")
    return f"{base_url}/uploads/{filename}"


def safe_float(value, default: float = 0.0) -> float:
    """Safely convert a value to float."""
    try:
        return float(value)
    except (TypeError, ValueError):
        return default


def clamp(value: float, min_val: float, max_val: float) -> float:
    """Clamp a float between min and max."""
    return max(min_val, min(max_val, value))
