"""
AgriHelp Backend - Auth Service
Thin wrapper around Supabase authentication
"""
import logging

from supabase import Client, create_client

from config import get_settings
from models.schemas import AuthResponse, AuthSession, AuthUser

logger = logging.getLogger(__name__)
settings = get_settings()


def _get_client() -> Client:
    """Create a Supabase client using service role credentials."""
    if not settings.supabase_url or not settings.supabase_service_role_key:
        raise RuntimeError(
            "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env"
        )
    return create_client(settings.supabase_url, settings.supabase_service_role_key)


def _build_response(data) -> AuthResponse:
    """Map Supabase auth response to our AuthResponse schema."""
    user = None
    session = None

    if hasattr(data, "user") and data.user:
        u = data.user
        user = AuthUser(
            id=str(u.id),
            email=u.email,
            full_name=(u.user_metadata or {}).get("full_name"),
        )

    if hasattr(data, "session") and data.session:
        s = data.session
        session = AuthSession(
            access_token=s.access_token,
            refresh_token=s.refresh_token,
            expires_in=s.expires_in or 3600,
        )

    return AuthResponse(user=user, session=session)


async def sign_in(email: str, password: str) -> AuthResponse:
    """Authenticate an existing user with email + password."""
    try:
        client = _get_client()
        result = client.auth.sign_in_with_password(
            {"email": email, "password": password}
        )
        return _build_response(result)
    except Exception as exc:
        logger.warning("Sign-in failed for %s: %s", email, exc)
        raise


async def sign_up(email: str, password: str, full_name: str | None = None) -> AuthResponse:
    """Register a new user."""
    try:
        client = _get_client()
        options: dict = {}
        if full_name:
            options["data"] = {"full_name": full_name}
        result = client.auth.sign_up(
            {"email": email, "password": password, "options": options}
        )
        return _build_response(result)
    except Exception as exc:
        logger.warning("Sign-up failed for %s: %s", email, exc)
        raise


async def sign_out(access_token: str | None = None) -> AuthResponse:
    """Invalidate the user session."""
    try:
        client = _get_client()
        if access_token:
            client.auth.admin.sign_out(access_token)
        return AuthResponse(message="Signed out successfully.")
    except Exception as exc:
        logger.warning("Sign-out error: %s", exc)
        # Treat sign-out errors as non-fatal
        return AuthResponse(message="Signed out.")


async def refresh_token(refresh_token_value: str) -> AuthResponse:
    """Refresh an expired access token."""
    try:
        client = _get_client()
        result = client.auth.refresh_session(refresh_token_value)
        return _build_response(result)
    except Exception as exc:
        logger.warning("Token refresh failed: %s", exc)
        raise
