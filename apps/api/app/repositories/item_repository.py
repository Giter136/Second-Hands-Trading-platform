from __future__ import annotations

from datetime import datetime
from decimal import Decimal

from sqlalchemy import and_, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.item import Item
from app.models.item_audit import ItemAudit
from app.models.item_image import ItemImage
from app.models.user import User


class ItemRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def get_item_by_id(self, item_id: int) -> Item | None:
        stmt = select(Item).where(Item.id == item_id)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_item_images(self, item_id: int) -> list[ItemImage]:
        stmt = select(ItemImage).where(ItemImage.item_id == item_id).order_by(ItemImage.sort_order.asc())
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def list_items(self, category: str | None, page: int, size: int) -> tuple[list[Item], int]:
        conditions = [Item.status == 1]
        if category:
            conditions.append(Item.category == category)

        where_clause = and_(*conditions)

        total_stmt = select(func.count()).select_from(Item).where(where_clause)
        total_result = await self.session.execute(total_stmt)
        total = int(total_result.scalar_one() or 0)

        stmt = (
            select(Item)
            .where(where_clause)
            .order_by(Item.created_at.desc())
            .offset((page - 1) * size)
            .limit(size)
        )
        result = await self.session.execute(stmt)
        return list(result.scalars().all()), total

    async def create_item(
        self,
        seller_id: int,
        title: str,
        category: str,
        condition_level: int,
        price: float,
        description: str,
        city: str,
    ) -> Item:
        item = Item(
            seller_id=seller_id,
            title=title,
            category=category,
            condition_level=condition_level,
            price=Decimal(str(price)),
            description=description,
            city=city,
            status=0,
        )
        self.session.add(item)
        await self.session.flush()
        await self.session.refresh(item)
        return item

    async def create_item_images(self, item_id: int, image_urls: list[str]) -> list[ItemImage]:
        images: list[ItemImage] = []
        for index, url in enumerate(image_urls):
            image = ItemImage(item_id=item_id, image_url=url, sort_order=index)
            self.session.add(image)
            images.append(image)

        await self.session.flush()
        return images

    async def update_item_status(
        self,
        item: Item,
        status: int,
        reject_reason: str | None = None,
        published_at: datetime | None = None,
    ) -> Item:
        item.status = status
        item.reject_reason = reject_reason
        item.published_at = published_at
        await self.session.flush()
        await self.session.refresh(item)
        return item

    async def list_admin_items(self, status: int | None, page: int, size: int) -> tuple[list[tuple[Item, User]], int]:
        count_stmt = select(func.count()).select_from(Item)
        if status is not None:
            count_stmt = count_stmt.where(Item.status == status)
        total_result = await self.session.execute(count_stmt)
        total = int(total_result.scalar_one() or 0)

        stmt = select(Item, User).join(User, User.id == Item.seller_id)
        if status is not None:
            stmt = stmt.where(Item.status == status)

        stmt = stmt.order_by(Item.created_at.desc()).offset((page - 1) * size).limit(size)
        result = await self.session.execute(stmt)
        return list(result.all()), total

    async def create_item_audit(self, item_id: int, admin_id: int, result: int, reason: str | None) -> ItemAudit:
        audit = ItemAudit(
            item_id=item_id,
            admin_id=admin_id,
            result=result,
            reason=reason,
        )
        self.session.add(audit)
        await self.session.flush()
        await self.session.refresh(audit)
        return audit
