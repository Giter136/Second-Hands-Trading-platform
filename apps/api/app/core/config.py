from functools import lru_cache

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

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
        case_sensitive=False,
    )

    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()
