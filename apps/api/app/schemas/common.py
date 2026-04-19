from __future__ import annotations

from typing import Generic, Optional, TypeVar

from app.schemas.base import CamelModel

DataT = TypeVar("DataT")


class ApiResponse(CamelModel, Generic[DataT]):
    code: int = 200
    message: str = "success"
    data: Optional[DataT] = None
