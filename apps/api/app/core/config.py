from functools import lru_cache
from typing import Optional

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Second-hand Trading API"
    app_env: str = "local"
    app_host: str = "127.0.0.1"
    app_port: int = 8000
    api_prefix: str = "/api/v1"

    database_url: str = "mysql+asyncmy://user:password@127.0.0.1:3306/second_hand"
    sql_echo: bool = False
    auto_create_tables: bool = True

    jwt_secret: str = "replace_me"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 10080

    cors_origins: str = "http://localhost:3000,http://127.0.0.1:3000"
    cors_origin_regex: Optional[str] = None

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
        case_sensitive=False,
    )

    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]

    @property
    def cors_origin_regex_effective(self) -> Optional[str]:
        if self.cors_origin_regex:
            return self.cors_origin_regex
        if self.app_env.lower() == "local":
            return r"^https?://(localhost|127\.0\.0\.1)(:\d+)?$"
        return None


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()
