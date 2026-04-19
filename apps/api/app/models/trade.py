from __future__ import annotations

from datetime import datetime
from decimal import Decimal
from typing import Optional

from sqlalchemy import BigInteger, DateTime, ForeignKey, Integer, Numeric, SmallInteger, String
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, TimestampMixin


class Trade(Base, TimestampMixin):
    __tablename__ = "trades"

    id: Mapped[int] = mapped_column(BigInteger().with_variant(Integer, "sqlite"), primary_key=True, autoincrement=True)
    item_id: Mapped[int] = mapped_column(BigInteger, ForeignKey("items.id"), nullable=False, index=True)
    buyer_id: Mapped[int] = mapped_column(BigInteger, ForeignKey("users.id"), nullable=False, index=True)
    seller_id: Mapped[int] = mapped_column(BigInteger, ForeignKey("users.id"), nullable=False, index=True)
    conversation_id: Mapped[int] = mapped_column(BigInteger, ForeignKey("conversations.id"), nullable=False, index=True)

    agreed_price: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    meetup_location: Mapped[str] = mapped_column(String(120), nullable=False)
    meetup_time: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)

    status: Mapped[int] = mapped_column(SmallInteger, nullable=False, default=0)
    cancel_reason: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)

    buyer_confirmed_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    seller_confirmed_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
