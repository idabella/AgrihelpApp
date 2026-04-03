"""
AgriHelp Backend - Application Configuration
Reads settings from environment variables / .env file
"""
from functools import lru_cache
from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # Server
    port: int = 3000
    host: str = "0.0.0.0"
    debug: bool = False

    # CORS
    allowed_origins: str = "http://localhost:5173,http://localhost:3000"

    # Gemini AI
    gemini_api_key: str = ""
    gemini_model: str = "gemini-1.5-flash"
    gemini_vision_model: str = "gemini-1.5-flash"

    # Supabase
    supabase_url: str = ""
    supabase_anon_key: str = ""
    supabase_service_role_key: str = ""

    # JWT
    jwt_secret: str = "change-me-in-production"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 60

    # File upload
    max_image_size_mb: int = 10
    upload_dir: str = "./uploads"

    @property
    def cors_origins(self) -> List[str]:
        """Parse comma-separated origins into a list."""
        return [o.strip() for o in self.allowed_origins.split(",") if o.strip()]

    @property
    def max_image_size_bytes(self) -> int:
        return self.max_image_size_mb * 1024 * 1024


@lru_cache()
def get_settings() -> Settings:
    """Return cached settings instance."""
    return Settings()
