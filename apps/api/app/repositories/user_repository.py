from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User


class UserRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def get_by_phone(self, phone: str) -> User | None:
        stmt = select(User).where(User.phone == phone)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_by_id(self, user_id: int) -> User | None:
        stmt = select(User).where(User.id == user_id)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def create(self, phone: str, password_hash: str, nickname: str) -> User:
        user = User(
            phone=phone,
            password_hash=password_hash,
            nickname=nickname,
            role=0,
            status=1,
        )
        self.session.add(user)
        await self.session.flush()
        await self.session.refresh(user)
        return user
