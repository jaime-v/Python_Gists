"""
config.py

Configuration file for pydantic-settings
Apparently this is like python dotenv, but with validation built in
"""

from pydantic import SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
            env_file=".env",
            env_file_encoding="utf-8",
            )
    database_url: str
    secret_key: SecretStr
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30

# Loaded from .env -- additional comment to silence warning
settings = Settings() # type: ignore[call-arg]
