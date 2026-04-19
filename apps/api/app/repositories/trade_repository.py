from __future__ import annotations

from datetime import datetime
from decimal import Decimal
from typing import Optional

from sqlalchemy import and_, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.conversation import Conversation
from app.models.item import Item
from app.models.trade import Trade


class TradeRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def get_item_by_id(self, item_id: int) -> Item | None:
        stmt = select(Item).where(Item.id == item_id)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_conversation_by_id(self, conversation_id: int) -> Conversation | None:
        stmt = select(Conversation).where(Conversation.id == conversation_id)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_trade_by_id(self, trade_id: int) -> Trade | None:
        stmt = select(Trade).where(Trade.id == trade_id)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_active_trade_by_item(self, item_id: int) -> Trade | None:
        stmt = select(Trade).where(and_(Trade.item_id == item_id, Trade.status.in_([0, 1, 2])))
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def create_trade(
        self,
        item_id: int,
        buyer_id: int,
        seller_id: int,
        conversation_id: int,
        agreed_price: float,
        meetup_location: str,
    ) -> Trade:
        trade = Trade(
            item_id=item_id,
            buyer_id=buyer_id,
            seller_id=seller_id,
            conversation_id=conversation_id,
            agreed_price=Decimal(str(agreed_price)),
            meetup_location=meetup_location,
            status=1,
        )
        self.session.add(trade)
        await self.session.flush()
        await self.session.refresh(trade)
        return trade

    async def update_trade(
        self,
        trade: Trade,
        status: Optional[int] = None,
        cancel_reason: Optional[str] = None,
        buyer_confirmed_at: Optional[datetime] = None,
        seller_confirmed_at: Optional[datetime] = None,
        completed_at: Optional[datetime] = None,
    ) -> Trade:
        if status is not None:
            trade.status = status
        if cancel_reason is not None:
            trade.cancel_reason = cancel_reason
        if buyer_confirmed_at is not None:
            trade.buyer_confirmed_at = buyer_confirmed_at
        if seller_confirmed_at is not None:
            trade.seller_confirmed_at = seller_confirmed_at
        if completed_at is not None:
            trade.completed_at = completed_at

        await self.session.flush()
        await self.session.refresh(trade)
        return trade

    async def update_item_status(self, item: Item, status: int, sold_at: Optional[datetime] = None) -> Item:
        item.status = status
        if sold_at is not None:
            item.sold_at = sold_at
        await self.session.flush()
        await self.session.refresh(item)
        return item

    async def update_conversation_status(self, conversation: Conversation, status: int) -> Conversation:
        conversation.status = status
        await self.session.flush()
        await self.session.refresh(conversation)
        return conversation

    async def list_admin_trades(self, status: Optional[int], page: int, size: int) -> tuple[list[Trade], int]:
        count_stmt = select(func.count()).select_from(Trade)
        if status is not None:
            count_stmt = count_stmt.where(Trade.status == status)

        total_result = await self.session.execute(count_stmt)
        total = int(total_result.scalar_one() or 0)

        stmt = select(Trade)
        if status is not None:
            stmt = stmt.where(Trade.status == status)

        stmt = stmt.order_by(Trade.created_at.desc()).offset((page - 1) * size).limit(size)
        result = await self.session.execute(stmt)
        return list(result.scalars().all()), total
