from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session, get_tx_session
from app.core.dependencies import get_current_admin
from app.core.exceptions import ConflictException, NotFoundException
from app.core.response import success_response
from app.models.user import User
from app.repositories.item_repository import ItemRepository
from app.repositories.trade_repository import TradeRepository
from app.repositories.user_repository import UserRepository
from app.schemas.admin import FreezeUserRequest, ItemAuditDTO, ItemAuditRequest
from app.schemas.item import AdminItemListData
from app.services.item_service import ItemService
from app.services.trade_service import TradeService
from app.schemas.trade import TradeListData

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/items")
async def get_admin_items(
    status: Optional[int] = Query(default=None),
    page: int = Query(default=1, ge=1),
    size: int = Query(default=20, ge=1, le=100),
    _: User = Depends(get_current_admin),
    session: AsyncSession = Depends(get_session),
):
    service = ItemService(ItemRepository(session))
    items, total = await service.list_admin_items(status=status, page=page, size=size)
    data = AdminItemListData(total=total, items=items)
    return success_response(data=data.model_dump(by_alias=True))


@router.post("/items/{item_id}/audit")
async def audit_item(
    item_id: int,
    payload: ItemAuditRequest,
    admin_user: User = Depends(get_current_admin),
    session: AsyncSession = Depends(get_tx_session),
):
    service = ItemService(ItemRepository(session))
    audit = await service.audit_item(item_id=item_id, admin_user=admin_user, payload=payload)
    data = ItemAuditDTO.model_validate(audit)
    return success_response(data=data.model_dump(by_alias=True))


@router.get("/trades")
async def get_admin_trades(
    status: Optional[int] = Query(default=None),
    page: int = Query(default=1, ge=1),
    size: int = Query(default=20, ge=1, le=100),
    _: User = Depends(get_current_admin),
    session: AsyncSession = Depends(get_session),
):
    service = TradeService(TradeRepository(session))
    trades, total = await service.list_admin_trades(status=status, page=page, size=size)
    data = TradeListData(trades=trades, total=total)
    return success_response(data=data.model_dump(by_alias=True))


@router.post("/users/{user_id}/freeze")
async def freeze_user(
    user_id: int,
    payload: FreezeUserRequest,
    admin_user: User = Depends(get_current_admin),
    session: AsyncSession = Depends(get_tx_session),
):
    user_repository = UserRepository(session)
    user = await user_repository.get_by_id(user_id)
    if user is None:
        raise NotFoundException("user not found")
    if user.role == 1:
        raise ConflictException("cannot freeze admin")
    if user.id == admin_user.id:
        raise ConflictException("cannot freeze yourself")

    # Reason is validated in request schema and reserved for future audit logging.
    _ = payload.reason
    await user_repository.freeze_user(user)
    return success_response(data=None)
