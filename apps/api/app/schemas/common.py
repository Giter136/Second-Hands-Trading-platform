from typing import Generic, TypeVar

from app.schemas.base import CamelModel

DataT = TypeVar("DataT")


class ApiResponse(CamelModel, Generic[DataT]):
    code: int = 200
    message: str = "success"
    data: DataT | None = None
