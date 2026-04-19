from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import AliasChoices, Field, field_validator

from app.schemas.base import CamelModel


class TradeDTO(CamelModel):
    id: int
    item_id: int
    buyer_id: int
    seller_id: int
    conversation_id: int
    agreed_price: float
    meetup_location: str
    meetup_time: Optional[datetime] = None
    status: int
    cancel_reason: Optional[str] = None
    created_at: datetime


class TradeListData(CamelModel):
    trades: list[TradeDTO]
    total: int


class TradeCreateRequest(CamelModel):
    item_id: int = Field(validation_alias=AliasChoices("item_id", "itemId"))
    conversation_id: int = Field(validation_alias=AliasChoices("conversation_id", "conversationId"))
    agreed_price: float = Field(validation_alias=AliasChoices("agreed_price", "agreedPrice"))
    meetup_location: str = Field(validation_alias=AliasChoices("meetup_location", "meetupLocation"))

    @field_validator("agreed_price")
    @classmethod
    def validate_agreed_price(cls, value: float) -> float:
        if value <= 0:
            raise ValueError("agreed_price must be > 0")
        return value

    @field_validator("meetup_location")
    @classmethod
    def validate_meetup_location(cls, value: str) -> str:
        value = value.strip()
        if len(value) < 2 or len(value) > 120:
            raise ValueError("meetup_location length must be 2-120")
        return value


class TradeCancelRequest(CamelModel):
    cancel_reason: Optional[str] = Field(
        default=None,
        validation_alias=AliasChoices("cancel_reason", "cancelReason", "reason"),
    )

    @field_validator("cancel_reason")
    @classmethod
    def validate_cancel_reason(cls, value: Optional[str]) -> Optional[str]:
        if value is None:
            return None
        value = value.strip()
        if len(value) == 0:
            return None
        if len(value) > 200:
            raise ValueError("cancel_reason length must be <= 200")
        return value
