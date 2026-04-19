from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import AliasChoices, Field, model_validator

from app.schemas.base import CamelModel


class AuthLoginRequest(CamelModel):
    phone: Optional[str] = None
    username: Optional[str] = None
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
    avatar_url: Optional[str] = None
    role: int
    status: int
    created_at: Optional[datetime] = None


class AuthLoginData(CamelModel):
    token: str
    user: UserDTO


class AuthRegisterData(CamelModel):
    user: UserDTO
