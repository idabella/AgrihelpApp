"""
AgriHelp Backend - LLM Router
Endpoints: POST /api/llm/chat, POST /api/llm/stream
"""
import logging

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse

from models.schemas import LLMRequest, LLMResponse
from services import llm_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/llm", tags=["LLM"])


@router.post("/chat", response_model=LLMResponse)
async def chat(request: LLMRequest) -> LLMResponse:
    """
    Send a message to the agricultural AI assistant.
    Supports Darija, French, and Arabic responses.
    Optional conversation history for multi-turn conversations.
    """
    try:
        return await llm_service.chat(request)
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc))
    except Exception as exc:
        logger.exception("Unexpected error in /api/llm/chat")
        raise HTTPException(
            status_code=500,
            detail="Internal error while processing your request.",
        )


@router.post("/stream")
async def stream(request: LLMRequest) -> StreamingResponse:
    """
    Stream an AI response as Server-Sent Events (SSE).
    Each event is: data: {"chunk": "..."}\n\n
    Final event is: data: [DONE]\n\n
    """
    try:
        return StreamingResponse(
            llm_service.stream_chat(request),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "X-Accel-Buffering": "no",  # Disable Nginx buffering
            },
        )
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc))
    except Exception:
        logger.exception("Unexpected error in /api/llm/stream")
        raise HTTPException(status_code=500, detail="Streaming error.")
