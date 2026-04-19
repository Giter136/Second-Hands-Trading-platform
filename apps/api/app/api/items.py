from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session, get_tx_session
from app.core.dependencies import get_current_user
from app.core.response import success_response
from app.models.user import User
from app.repositories.item_repository import ItemRepository
from app.schemas.item import ItemCreateRequest, ItemListData, ItemStatusUpdateRequest
from app.services.item_service import ItemService

router = APIRouter(prefix="/items", tags=["items"])


@router.get("")
async def get_items(
    category: Optional[str] = Query(default=None),
    page: int = Query(default=1, ge=1),
    size: int = Query(default=20, ge=1, le=100),
    session: AsyncSession = Depends(get_session),
):
    service = ItemService(ItemRepository(session))
    items, total = await service.get_market_items(category=category, page=page, size=size)
    data = ItemListData(items=items, total=total)
    return success_response(data=data.model_dump(by_alias=True))


@router.get("/{item_id}")
async def get_item_detail(item_id: int, session: AsyncSession = Depends(get_session)):
    service = ItemService(ItemRepository(session))
    item = await service.get_item_detail(item_id)
    return success_response(data=item.model_dump(by_alias=True))


@router.post("")
async def publish_item(
    payload: ItemCreateRequest,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_tx_session),
):
    service = ItemService(ItemRepository(session))
    item = await service.publish_item(current_user=current_user, payload=payload)
    return success_response(data=item.model_dump(by_alias=True))


@router.patch("/{item_id}/status")
async def update_item_status(
    item_id: int,
    payload: ItemStatusUpdateRequest,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_tx_session),
):
    service = ItemService(ItemRepository(session))
    await service.update_item_status(current_user=current_user, item_id=item_id, status=payload.status)
    return success_response(data=None)
