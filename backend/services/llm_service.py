"""
AgriHelp Backend - LLM Service
Integrates with Google Gemini for multilingual agricultural advice
"""
import json
import logging
from typing import AsyncGenerator, List, Optional

import google.generativeai as genai

from config import get_settings
from models.schemas import ConversationMessage, Language, LLMRequest, LLMResponse

logger = logging.getLogger(__name__)
settings = get_settings()

# System prompt templates per language
SYSTEM_PROMPTS: dict[str, str] = {
    "darija": (
        "أنت مساعد زراعي متخصص اسمك AgriHelp. تتحدث بالدارجة المغربية. "
        "مهمتك هي تقديم النصائح الزراعية المتعلقة بالمحاصيل والأمراض والآفات والري والأسمدة. "
        "اجعل إجاباتك عملية ومفيدة للمزارع المغربي. "
        "إذا لم تكن متأكداً، قل ذلك بوضوح وانصح باستشارة متخصص."
    ),
    "french": (
        "Vous êtes AgriHelp, un assistant agricole spécialisé pour les agriculteurs marocains. "
        "Répondez en français. Votre mission est de fournir des conseils agricoles pratiques "
        "sur les cultures, les maladies, les ravageurs, l'irrigation et les engrais. "
        "Soyez précis et adapté au contexte agricole marocain. "
        "Si vous n'êtes pas certain, dites-le clairement et recommandez un spécialiste."
    ),
    "arabic": (
        "أنت مساعد زراعي متخصص اسمك AgriHelp. تتحدث باللغة العربية الفصحى. "
        "مهمتك تقديم النصائح الزراعية المتعلقة بالمحاصيل والأمراض والآفات والري والأسمدة. "
        "اجعل إجاباتك عملية ومناسبة للمزارع العربي. "
        "إذا لم تكن متأكداً، أوصِ باستشارة متخصص."
    ),
}


def _configure_gemini() -> None:
    """Configure the Gemini client (idempotent)."""
    if not settings.gemini_api_key:
        raise RuntimeError(
            "GEMINI_API_KEY is not set. Please configure it in your .env file."
        )
    genai.configure(api_key=settings.gemini_api_key)


def _build_history(
    history: Optional[List[ConversationMessage]],
) -> list[dict]:
    """Convert conversation history to Gemini format."""
    if not history:
        return []
    result = []
    for msg in history:
        role = "user" if msg.role == "user" else "model"
        result.append({"role": role, "parts": [{"text": msg.content}]})
    return result


async def chat(request: LLMRequest) -> LLMResponse:
    """
    Send a message to Gemini and return a complete response.
    Supports optional image URL context and conversation history.
    """
    _configure_gemini()

    system_prompt = SYSTEM_PROMPTS.get(request.language, SYSTEM_PROMPTS["french"])
    model = genai.GenerativeModel(
        model_name=settings.gemini_model,
        system_instruction=system_prompt,
    )

    history = _build_history(request.conversation_history)
    chat_session = model.start_chat(history=history)

    # Build message parts
    parts: list = [request.message]
    if request.image_url:
        parts.insert(0, f"[Image attached: {request.image_url}]\n")

    try:
        response = await chat_session.send_message_async(parts)
        return LLMResponse(
            response=response.text,
            confidence=None,
            sources=None,
        )
    except Exception as exc:
        logger.exception("Gemini chat error: %s", exc)
        raise


async def stream_chat(request: LLMRequest) -> AsyncGenerator[str, None]:
    """
    Stream a chat response from Gemini as Server-Sent Events chunks.
    Each yielded string is a raw text chunk.
    """
    _configure_gemini()

    system_prompt = SYSTEM_PROMPTS.get(request.language, SYSTEM_PROMPTS["french"])
    model = genai.GenerativeModel(
        model_name=settings.gemini_model,
        system_instruction=system_prompt,
    )

    history = _build_history(request.conversation_history)
    chat_session = model.start_chat(history=history)

    parts: list = [request.message]
    if request.image_url:
        parts.insert(0, f"[Image attached: {request.image_url}]\n")

    try:
        async for chunk in await chat_session.send_message_async(parts, stream=True):
            if chunk.text:
                # SSE format: "data: <payload>\n\n"
                payload = json.dumps({"chunk": chunk.text})
                yield f"data: {payload}\n\n"
        yield "data: [DONE]\n\n"
    except Exception as exc:
        logger.exception("Gemini stream error: %s", exc)
        error_payload = json.dumps({"error": str(exc)})
        yield f"data: {error_payload}\n\n"
        raise
