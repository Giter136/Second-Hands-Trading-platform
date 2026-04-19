from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_tx_session
from app.core.dependencies import get_current_user
from app.core.response import success_response
from app.models.user import User
from app.repositories.trade_repository import TradeRepository
from app.schemas.trade import TradeCancelRequest, TradeCreateRequest
from app.services.trade_service import TradeService

router = APIRouter(prefix="/trades", tags=["trades"])


@router.post("")
async def create_trade(
    payload: TradeCreateRequest,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_tx_session),
):
    service = TradeService(TradeRepository(session))
    trade = await service.create_trade(current_user=current_user, payload=payload)
    return success_response(data=trade.model_dump(by_alias=True))


@router.post("/{trade_id}/confirm")
async def confirm_trade(
    trade_id: int,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_tx_session),
):
    service = TradeService(TradeRepository(session))
    trade = await service.confirm_trade(current_user=current_user, trade_id=trade_id)
    return success_response(data=trade.model_dump(by_alias=True))


@router.post("/{trade_id}/cancel")
async def cancel_trade(
    trade_id: int,
    payload: Optional[TradeCancelRequest] = None,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_tx_session),
):
    service = TradeService(TradeRepository(session))
    safe_payload = payload or TradeCancelRequest()
    trade = await service.cancel_trade(current_user=current_user, trade_id=trade_id, payload=safe_payload)
    return success_response(data=trade.model_dump(by_alias=True))


@router.post("/{trade_id}/complete")
async def complete_trade(
    trade_id: int,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_tx_session),
):
    service = TradeService(TradeRepository(session))
    trade = await service.complete_trade(current_user=current_user, trade_id=trade_id)
    return success_response(data=trade.model_dump(by_alias=True))
