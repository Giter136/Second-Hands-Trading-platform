from __future__ import annotations

from datetime import datetime, timezone
from typing import Optional

from app.core.exceptions import ConflictException, ForbiddenException, NotFoundException
from app.models.user import User
from app.repositories.trade_repository import TradeRepository
from app.schemas.trade import TradeCancelRequest, TradeCreateRequest, TradeDTO


class TradeService:
    def __init__(self, trade_repository: TradeRepository) -> None:
        self.trade_repository = trade_repository

    async def create_trade(self, current_user: User, payload: TradeCreateRequest) -> TradeDTO:
        item = await self.trade_repository.get_item_by_id(payload.item_id)
        if item is None:
            raise NotFoundException("item not found")

        conversation = await self.trade_repository.get_conversation_by_id(payload.conversation_id)
        if conversation is None:
            raise NotFoundException("conversation not found")

        if conversation.item_id != item.id:
            raise ConflictException("conversation does not match item")
        if current_user.id != conversation.buyer_id:
            raise ForbiddenException("only buyer can create trade")
        if item.seller_id != conversation.seller_id:
            raise ConflictException("conversation seller does not match item")
        if item.status != 1:
            raise ConflictException("item status is not tradable")

        active_trade = await self.trade_repository.get_active_trade_by_item(item.id)
        if active_trade is not None:
            raise ConflictException("active trade already exists for this item")

        trade = await self.trade_repository.create_trade(
            item_id=item.id,
            buyer_id=conversation.buyer_id,
            seller_id=conversation.seller_id,
            conversation_id=conversation.id,
            agreed_price=payload.agreed_price,
            meetup_location=payload.meetup_location,
        )

        await self.trade_repository.update_item_status(item=item, status=2)
        return TradeDTO.model_validate({**trade.__dict__, "agreed_price": float(trade.agreed_price)})

    async def confirm_trade(self, current_user: User, trade_id: int) -> TradeDTO:
        trade = await self.trade_repository.get_trade_by_id(trade_id)
        if trade is None:
            raise NotFoundException("trade not found")
        if current_user.id != trade.seller_id:
            raise ForbiddenException("only seller can confirm trade")
        if trade.status != 1:
            raise ConflictException("trade status is not confirmable")

        trade = await self.trade_repository.update_trade(trade=trade, status=2)
        return TradeDTO.model_validate({**trade.__dict__, "agreed_price": float(trade.agreed_price)})

    async def cancel_trade(self, current_user: User, trade_id: int, payload: TradeCancelRequest) -> TradeDTO:
        trade = await self.trade_repository.get_trade_by_id(trade_id)
        if trade is None:
            raise NotFoundException("trade not found")
        if current_user.id not in (trade.buyer_id, trade.seller_id) and current_user.role != 1:
            raise ForbiddenException("no permission to cancel trade")
        if trade.status not in (0, 1, 2):
            raise ConflictException("trade status is not cancellable")

        trade = await self.trade_repository.update_trade(
            trade=trade,
            status=4,
            cancel_reason=payload.cancel_reason,
        )

        item = await self.trade_repository.get_item_by_id(trade.item_id)
        if item is not None and item.status == 2:
            await self.trade_repository.update_item_status(item=item, status=1, sold_at=None)

        conversation = await self.trade_repository.get_conversation_by_id(trade.conversation_id)
        if conversation is not None:
            await self.trade_repository.update_conversation_status(conversation=conversation, status=1)

        return TradeDTO.model_validate({**trade.__dict__, "agreed_price": float(trade.agreed_price)})

    async def complete_trade(self, current_user: User, trade_id: int) -> TradeDTO:
        trade = await self.trade_repository.get_trade_by_id(trade_id)
        if trade is None:
            raise NotFoundException("trade not found")
        if current_user.id not in (trade.buyer_id, trade.seller_id):
            raise ForbiddenException("no permission to complete trade")
        if trade.status != 2:
            raise ConflictException("trade must be confirmed before complete")

        now = datetime.now(timezone.utc)
        update_kwargs = {"status": 2}
        if current_user.id == trade.buyer_id:
            update_kwargs["buyer_confirmed_at"] = now
        else:
            update_kwargs["seller_confirmed_at"] = now

        trade = await self.trade_repository.update_trade(trade=trade, **update_kwargs)

        if trade.buyer_confirmed_at is not None and trade.seller_confirmed_at is not None:
            trade = await self.trade_repository.update_trade(trade=trade, status=3, completed_at=now)

            item = await self.trade_repository.get_item_by_id(trade.item_id)
            if item is not None:
                await self.trade_repository.update_item_status(item=item, status=3, sold_at=now)

            conversation = await self.trade_repository.get_conversation_by_id(trade.conversation_id)
            if conversation is not None:
                await self.trade_repository.update_conversation_status(conversation=conversation, status=0)

        return TradeDTO.model_validate({**trade.__dict__, "agreed_price": float(trade.agreed_price)})

    async def list_admin_trades(self, status: Optional[int], page: int, size: int) -> tuple[list[TradeDTO], int]:
        rows, total = await self.trade_repository.list_admin_trades(status=status, page=page, size=size)
        trades = [TradeDTO.model_validate({**trade.__dict__, "agreed_price": float(trade.agreed_price)}) for trade in rows]
        return trades, total
