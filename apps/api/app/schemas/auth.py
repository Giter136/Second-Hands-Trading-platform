from datetime import datetime

from pydantic import AliasChoices, Field, model_validator

from app.schemas.base import CamelModel


class AuthLoginRequest(CamelModel):
    phone: str | None = None
    username: str | None = None
    password_hash: str = Field(validation_alias=AliasChoices("password_hash", "passwordHash"))

    @model_validator(mode="after")
    def validate_account(self) -> "AuthLoginRequest":
        if not self.phone and not self.username:
            raise ValueError("phone or username is required")
        return self


class AuthRegisterRequest(CamelModel):
    phone: str
    password_hash: str = Field(validation_alias=AliasChoices("password_hash", "passwordHash"))
    nickname: str


class UserDTO(CamelModel):
    id: int
    phone: str
    nickname: str
    avatar_url: str | None = None
    role: int
    status: int
    created_at: datetime | None = None


class AuthLoginData(CamelModel):
    token: str
    user: UserDTO


class AuthRegisterData(CamelModel):
    user: UserDTO
