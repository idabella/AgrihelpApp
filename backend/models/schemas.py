"""
AgriHelp Backend - Pydantic Schemas
Request/Response models matching the TypeScript interfaces in the frontend
"""
from typing import List, Literal, Optional

from pydantic import BaseModel, Field


# ---------------------------------------------------------------------------
# Common
# ---------------------------------------------------------------------------
Language = Literal["darija", "french", "arabic"]
AnalysisType = Literal["disease", "pest", "nutrient", "general"]
Severity = Literal["low", "medium", "high", "critical"]


# ---------------------------------------------------------------------------
# LLM / Chat
# ---------------------------------------------------------------------------
class ConversationMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class LLMRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=4000)
    language: Language
    image_url: Optional[str] = Field(None, alias="imageUrl")
    conversation_history: Optional[List[ConversationMessage]] = Field(
        None, alias="conversationHistory"
    )

    model_config = {"populate_by_name": True}


class LLMResponse(BaseModel):
    response: str
    confidence: Optional[float] = None
    sources: Optional[List[str]] = None


# ---------------------------------------------------------------------------
# Image Analysis
# ---------------------------------------------------------------------------
class ImageAnalysisRequest(BaseModel):
    image_url: str = Field(..., alias="imageUrl")
    language: Language
    analysis_type: Optional[AnalysisType] = Field("general", alias="analysisType")

    model_config = {"populate_by_name": True}


class ImageBase64Request(BaseModel):
    image: str  # base64-encoded
    language: Language


class DiseaseDetection(BaseModel):
    disease_name: str = Field(..., alias="diseaseName")
    confidence: float  # 0–1
    severity: Severity
    affected_area: float = Field(..., alias="affectedArea")  # percentage 0–100

    model_config = {"populate_by_name": True}


class TreatmentRecommendation(BaseModel):
    method: str
    products: Optional[List[str]] = None
    steps: List[str]
    preventive_measures: List[str] = Field(..., alias="preventiveMeasures")
    estimated_cost: Optional[str] = Field(None, alias="estimatedCost")

    model_config = {"populate_by_name": True}


class ImageMetadata(BaseModel):
    width: int
    height: int
    format: str


class ImageAnalysisResponse(BaseModel):
    success: bool
    detections: List[DiseaseDetection]
    diagnosis: str
    treatment: TreatmentRecommendation
    additional_notes: Optional[str] = Field(None, alias="additionalNotes")
    image_metadata: Optional[ImageMetadata] = Field(None, alias="imageMetadata")

    model_config = {"populate_by_name": True}


class ImageUploadResponse(BaseModel):
    image_url: str = Field(..., alias="imageUrl")

    model_config = {"populate_by_name": True}


# ---------------------------------------------------------------------------
# Authentication
# ---------------------------------------------------------------------------
class SignInRequest(BaseModel):
    email: str
    password: str


class SignUpRequest(BaseModel):
    email: str
    password: str
    full_name: Optional[str] = None


class SignOutRequest(BaseModel):
    access_token: Optional[str] = None


class RefreshRequest(BaseModel):
    refresh_token: str


class AuthUser(BaseModel):
    id: str
    email: Optional[str] = None
    full_name: Optional[str] = None


class AuthSession(BaseModel):
    access_token: str
    refresh_token: str
    expires_in: int
    token_type: str = "bearer"


class AuthResponse(BaseModel):
    user: Optional[AuthUser] = None
    session: Optional[AuthSession] = None
    message: Optional[str] = None


# ---------------------------------------------------------------------------
# Health Check
# ---------------------------------------------------------------------------
class HealthResponse(BaseModel):
    status: str = "ok"
    version: str = "1.0.0"
    services: dict = {}
