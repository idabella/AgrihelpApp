"""
AgriHelp Backend - Image Analysis Service
Uses Google Gemini Vision to detect crop diseases and generate treatment plans
"""
import base64
import json
import logging
import re
from io import BytesIO
from pathlib import Path
from typing import Optional
from urllib.request import urlopen

import google.generativeai as genai
from PIL import Image

from config import get_settings
from models.schemas import (
    AnalysisType,
    DiseaseDetection,
    ImageAnalysisResponse,
    ImageMetadata,
    Language,
    Severity,
    TreatmentRecommendation,
)

logger = logging.getLogger(__name__)
settings = get_settings()

# ---------------------------------------------------------------------------
# Language-specific prompts for image analysis
# ---------------------------------------------------------------------------
ANALYSIS_PROMPTS: dict[str, str] = {
    "darija": (
        "حلل هذه الصورة الزراعية وأعطني:\n"
        "1. اسم المرض أو المشكلة الموجودة\n"
        "2. مدى خطورتها\n"
        "3. نسبة المنطقة المتضررة\n"
        "4. طريقة العلاج والمنتجات المناسبة\n"
        "5. الإجراءات الوقائية\n"
        "رد بصيغة JSON فقط."
    ),
    "french": (
        "Analysez cette image agricole et fournissez:\n"
        "1. Le nom de la maladie ou du problème détecté\n"
        "2. Le niveau de gravité\n"
        "3. Le pourcentage de zone affectée\n"
        "4. La méthode de traitement et les produits recommandés\n"
        "5. Les mesures préventives\n"
        "Répondez uniquement en JSON."
    ),
    "arabic": (
        "حلل هذه الصورة الزراعية وقدم:\n"
        "1. اسم المرض أو المشكلة المكتشفة\n"
        "2. مستوى الخطورة\n"
        "3. نسبة المنطقة المتضررة\n"
        "4. طريقة العلاج والمنتجات الموصى بها\n"
        "5. الإجراءات الوقائية\n"
        "أجب بتنسيق JSON فقط."
    ),
}

JSON_SCHEMA_HINT = """
Return ONLY valid JSON matching this schema:
{
  "disease_name": "string",
  "confidence": 0.0-1.0,
  "severity": "low|medium|high|critical",
  "affected_area": 0-100,
  "diagnosis": "detailed description",
  "treatment": {
    "method": "string",
    "products": ["product1"],
    "steps": ["step1", "step2"],
    "preventive_measures": ["measure1"],
    "estimated_cost": "string or null"
  },
  "additional_notes": "string or null"
}
"""


def _configure_gemini() -> None:
    if not settings.gemini_api_key:
        raise RuntimeError("GEMINI_API_KEY is not configured.")
    genai.configure(api_key=settings.gemini_api_key)


def _load_image_from_url(image_url: str) -> Image.Image:
    """Load a PIL Image from a URL or local file path."""
    if image_url.startswith(("http://", "https://")):
        with urlopen(image_url) as resp:
            data = resp.read()
        return Image.open(BytesIO(data))
    # Local file path
    return Image.open(image_url)


def _load_image_from_base64(b64_string: str) -> Image.Image:
    """Decode a base64 string and return a PIL Image."""
    # Strip data URI prefix if present
    if "," in b64_string:
        b64_string = b64_string.split(",", 1)[1]
    data = base64.b64decode(b64_string)
    return Image.open(BytesIO(data))


def _get_image_metadata(img: Image.Image) -> ImageMetadata:
    return ImageMetadata(
        width=img.width,
        height=img.height,
        format=img.format or "JPEG",
    )


def _parse_gemini_response(raw_text: str, language: Language) -> ImageAnalysisResponse:
    """Parse Gemini's JSON response into our schema."""
    # Extract JSON block if wrapped in markdown code fences
    json_match = re.search(r"```(?:json)?\s*([\s\S]+?)\s*```", raw_text)
    json_str = json_match.group(1) if json_match else raw_text.strip()

    try:
        data = json.loads(json_str)
    except json.JSONDecodeError:
        logger.warning("Could not parse Gemini JSON, using fallback response.")
        return _fallback_response(language)

    treatment_data = data.get("treatment", {})
    treatment = TreatmentRecommendation(
        method=treatment_data.get("method", "Consult a local agronomist"),
        products=treatment_data.get("products"),
        steps=treatment_data.get("steps", []),
        preventive_measures=treatment_data.get("preventive_measures", []),
        estimated_cost=treatment_data.get("estimated_cost"),
    )

    detection = DiseaseDetection(
        disease_name=data.get("disease_name", "Unknown"),
        confidence=float(data.get("confidence", 0.5)),
        severity=data.get("severity", "medium"),
        affected_area=float(data.get("affected_area", 0)),
    )

    return ImageAnalysisResponse(
        success=True,
        detections=[detection],
        diagnosis=data.get("diagnosis", "Analysis complete."),
        treatment=treatment,
        additional_notes=data.get("additional_notes"),
    )


def _fallback_response(language: Language) -> ImageAnalysisResponse:
    msgs = {
        "darija": "ما قدرناش نحللوا الصورة. عاود المحاولة.",
        "french": "Impossible d'analyser l'image. Veuillez réessayer.",
        "arabic": "تعذر تحليل الصورة. يرجى المحاولة مجدداً.",
    }
    return ImageAnalysisResponse(
        success=False,
        detections=[],
        diagnosis=msgs.get(language, msgs["french"]),
        treatment=TreatmentRecommendation(
            method="N/A",
            steps=[],
            preventive_measures=[],
        ),
    )


async def analyze_image_pil(
    img: Image.Image,
    language: Language,
    analysis_type: Optional[AnalysisType] = "general",
) -> ImageAnalysisResponse:
    """Core analysis function that takes a PIL image."""
    _configure_gemini()
    model = genai.GenerativeModel(model_name=settings.gemini_vision_model)

    base_prompt = ANALYSIS_PROMPTS.get(language, ANALYSIS_PROMPTS["french"])
    full_prompt = f"{base_prompt}\n{JSON_SCHEMA_HINT}"
    if analysis_type and analysis_type != "general":
        full_prompt += f"\nFocus specifically on: {analysis_type}"

    metadata = _get_image_metadata(img)

    try:
        response = await model.generate_content_async([full_prompt, img])
        result = _parse_gemini_response(response.text, language)
        result.image_metadata = metadata
        return result
    except Exception as exc:
        logger.exception("Gemini vision error: %s", exc)
        raise


async def analyze_from_url(
    image_url: str,
    language: Language,
    analysis_type: Optional[AnalysisType] = "general",
) -> ImageAnalysisResponse:
    img = _load_image_from_url(image_url)
    return await analyze_image_pil(img, language, analysis_type)


async def analyze_from_base64(
    b64_string: str,
    language: Language,
) -> ImageAnalysisResponse:
    img = _load_image_from_base64(b64_string)
    return await analyze_image_pil(img, language, "general")
