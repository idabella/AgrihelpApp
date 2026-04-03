"""
AgriHelp Backend - Auth Router
Endpoints:
  POST /api/auth/signin   - Sign in with email + password
  POST /api/auth/signup   - Register new user
  POST /api/auth/signout  - Sign out
  POST /api/auth/refresh  - Refresh access token
"""
import logging

from fastapi import APIRouter, HTTPException

from models.schemas import (
    AuthResponse,
    RefreshRequest,
    SignInRequest,
    SignOutRequest,
    SignUpRequest,
)
from services import auth_service

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/signin", response_model=AuthResponse)
async def sign_in(body: SignInRequest) -> AuthResponse:
    """Authenticate user with email and password. Returns session tokens."""
    try:
        return await auth_service.sign_in(body.email, body.password)
    except Exception as exc:
        logger.warning("Sign-in failed: %s", exc)
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password.",
        )


@router.post("/signup", response_model=AuthResponse)
async def sign_up(body: SignUpRequest) -> AuthResponse:
    """Register a new user account."""
    try:
        return await auth_service.sign_up(body.email, body.password, body.full_name)
    except Exception as exc:
        logger.warning("Sign-up failed: %s", exc)
        raise HTTPException(
            status_code=400,
            detail="Could not create account. Email may already be in use.",
        )


@router.post("/signout", response_model=AuthResponse)
async def sign_out(body: SignOutRequest) -> AuthResponse:
    """Invalidate the current user session."""
    return await auth_service.sign_out(body.access_token)


@router.post("/refresh", response_model=AuthResponse)
async def refresh(body: RefreshRequest) -> AuthResponse:
    """Exchange a refresh token for a new access token."""
    try:
        return await auth_service.refresh_token(body.refresh_token)
    except Exception as exc:
        logger.warning("Token refresh failed: %s", exc)
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired refresh token.",
        )
