from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import AliasChoices, Field, field_validator

from app.schemas.base import CamelModel


class ItemImageDTO(CamelModel):
    id: int
    item_id: int
    image_url: str
    sort_order: int


class ItemDTO(CamelModel):
    id: int
    seller_id: int
    title: str
    category: str
    condition_level: int
    price: float
    description: str
    city: str
    status: int
    reject_reason: Optional[str] = None
    images: list[ItemImageDTO] = Field(default_factory=list)
    published_at: Optional[datetime] = None
    created_at: Optional[datetime] = None


class ItemCreateRequest(CamelModel):
    title: str
    category: str
    condition_level: int = Field(validation_alias=AliasChoices("condition_level", "conditionLevel"))
    price: float
    description: str
    city: str
    image_urls: list[str] = Field(validation_alias=AliasChoices("image_urls", "imageUrls"))

    @field_validator("title")
    @classmethod
    def validate_title(cls, value: str) -> str:
        value = value.strip()
        if len(value) < 5 or len(value) > 60:
            raise ValueError("title length must be 5-60")
        return value

    @field_validator("condition_level")
    @classmethod
    def validate_condition_level(cls, value: int) -> int:
        if value < 1 or value > 5:
            raise ValueError("condition_level must be 1-5")
        return value

    @field_validator("price")
    @classmethod
    def validate_price(cls, value: float) -> float:
        if value <= 0:
            raise ValueError("price must be > 0")
        return value

    @field_validator("description")
    @classmethod
    def validate_description(cls, value: str) -> str:
        value = value.strip()
        if len(value) < 10 or len(value) > 2000:
            raise ValueError("description length must be 10-2000")
        return value

    @field_validator("city")
    @classmethod
    def validate_city(cls, value: str) -> str:
        value = value.strip()
        if len(value) < 2 or len(value) > 30:
            raise ValueError("city length must be 2-30")
        return value

    @field_validator("image_urls")
    @classmethod
    def validate_images(cls, value: list[str]) -> list[str]:
        if len(value) < 1 or len(value) > 9:
            raise ValueError("image_urls count must be 1-9")
        return value


class ItemListData(CamelModel):
    items: list[ItemDTO]
    total: int


class ItemStatusUpdateRequest(CamelModel):
    status: int


class AdminItemListItem(CamelModel):
    id: int
    title: str
    price: float
    status: int
    seller: dict
    created_at: Optional[datetime] = None


class AdminItemListData(CamelModel):
    total: int
    items: list[AdminItemListItem]
