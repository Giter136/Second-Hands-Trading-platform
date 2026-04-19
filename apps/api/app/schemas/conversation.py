from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import AliasChoices, Field, field_validator

from app.schemas.base import CamelModel


class ConversationDTO(CamelModel):
    id: int
    item_id: int
    buyer_id: int
    seller_id: int
    status: int
    item: Optional[dict] = None
    created_at: datetime
    updated_at: datetime


class ConversationListData(CamelModel):
    conversations: list[ConversationDTO]
    total: int


class ConversationCreateRequest(CamelModel):
    item_id: int = Field(validation_alias=AliasChoices("item_id", "itemId"))


class MessageDTO(CamelModel):
    id: int
    conversation_id: int
    sender_id: int
    content: str
    created_at: datetime


class MessageListData(CamelModel):
    messages: list[MessageDTO]
    total: int


class MessageCreateRequest(CamelModel):
    content: str = Field(validation_alias=AliasChoices("content"))

    @field_validator("content")
    @classmethod
    def validate_content(cls, value: str) -> str:
        value = value.strip()
        if len(value) < 1 or len(value) > 1000:
            raise ValueError("content length must be 1-1000")
        return value
