from __future__ import annotations

from datetime import datetime, timezone

from app.core.exceptions import ConflictException, ForbiddenException, NotFoundException
from app.models.item import Item
from app.models.user import User
from app.repositories.item_repository import ItemRepository
from app.schemas.admin import ItemAuditRequest
from app.schemas.item import AdminItemListItem, ItemCreateRequest, ItemDTO


class ItemService:
    def __init__(self, item_repository: ItemRepository) -> None:
        self.item_repository = item_repository

    async def get_market_items(self, category: str | None, page: int, size: int) -> tuple[list[ItemDTO], int]:
        items, total = await self.item_repository.list_items(category=category, page=page, size=size)
        dto_items: list[ItemDTO] = []
        for item in items:
            images = await self.item_repository.get_item_images(item.id)
            dto_items.append(
                ItemDTO.model_validate(
                    {
                        **item.__dict__,
                        "price": float(item.price),
                        "images": images,
                    }
                )
            )
        return dto_items, total

    async def get_item_detail(self, item_id: int) -> ItemDTO:
        item = await self.item_repository.get_item_by_id(item_id)
        if item is None:
            raise NotFoundException("item not found")

        images = await self.item_repository.get_item_images(item.id)
        return ItemDTO.model_validate(
            {
                **item.__dict__,
                "price": float(item.price),
                "images": images,
            }
        )

    async def publish_item(self, current_user: User, payload: ItemCreateRequest) -> ItemDTO:
        if current_user.status != 1:
            raise ForbiddenException("账号已被冻结")

        item = await self.item_repository.create_item(
            seller_id=current_user.id,
            title=payload.title,
            category=payload.category,
            condition_level=payload.condition_level,
            price=payload.price,
            description=payload.description,
            city=payload.city,
        )
        images = await self.item_repository.create_item_images(item.id, payload.image_urls)

        return ItemDTO.model_validate(
            {
                **item.__dict__,
                "price": float(item.price),
                "images": images,
            }
        )

    async def update_item_status(self, current_user: User, item_id: int, status: int) -> None:
        item = await self.item_repository.get_item_by_id(item_id)
        if item is None:
            raise NotFoundException("item not found")
        if item.seller_id != current_user.id:
            raise ForbiddenException("cannot update others item")

        if status == 4 and item.status == 1:
            await self.item_repository.update_item_status(item, status=4)
            return

        raise ConflictException("invalid item status transition")

    async def list_admin_items(self, status: int | None, page: int, size: int) -> tuple[list[AdminItemListItem], int]:
        rows, total = await self.item_repository.list_admin_items(status=status, page=page, size=size)
        items: list[AdminItemListItem] = []
        for item, seller in rows:
            items.append(
                AdminItemListItem.model_validate(
                    {
                        "id": item.id,
                        "title": item.title,
                        "price": float(item.price),
                        "status": item.status,
                        "seller": {"id": seller.id, "nickname": seller.nickname},
                        "created_at": item.created_at,
                    }
                )
            )
        return items, total

    async def audit_item(self, item_id: int, admin_user: User, payload: ItemAuditRequest):
        item = await self.item_repository.get_item_by_id(item_id)
        if item is None:
            raise NotFoundException("item not found")
        if item.status not in (0, 5):
            raise ConflictException("item status is not auditable")

        reason = payload.reason.strip() if payload.reason else None
        if payload.result == 2 and not reason:
            raise ConflictException("reject reason required")

        if payload.result == 1:
            await self.item_repository.update_item_status(
                item,
                status=1,
                reject_reason=None,
                published_at=datetime.now(timezone.utc),
            )
        else:
            await self.item_repository.update_item_status(
                item,
                status=5,
                reject_reason=reason,
            )

        return await self.item_repository.create_item_audit(
            item_id=item.id,
            admin_id=admin_user.id,
            result=payload.result,
            reason=reason,
        )
