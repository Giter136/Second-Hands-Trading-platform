from __future__ import annotations

from typing import Optional

from pydantic import field_validator

from app.schemas.base import CamelModel


class ItemAuditRequest(CamelModel):
    result: int
    reason: Optional[str] = None

    @field_validator("result")
    @classmethod
    def validate_result(cls, value: int) -> int:
        if value not in (1, 2):
            raise ValueError("result must be 1 or 2")
        return value


class ItemAuditDTO(CamelModel):
    id: int
    item_id: int
    admin_id: int
    result: int
    reason: Optional[str] = None
