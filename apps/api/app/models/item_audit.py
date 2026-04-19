from __future__ import annotations

from typing import Optional

from sqlalchemy import BigInteger, ForeignKey, Integer, SmallInteger, String
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, TimestampMixin


class ItemAudit(Base, TimestampMixin):
    __tablename__ = "item_audits"

    id: Mapped[int] = mapped_column(BigInteger().with_variant(Integer, "sqlite"), primary_key=True, autoincrement=True)
    item_id: Mapped[int] = mapped_column(BigInteger, ForeignKey("items.id"), nullable=False, index=True)
    admin_id: Mapped[int] = mapped_column(BigInteger, ForeignKey("users.id"), nullable=False, index=True)
    result: Mapped[int] = mapped_column(SmallInteger, nullable=False)
    reason: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
