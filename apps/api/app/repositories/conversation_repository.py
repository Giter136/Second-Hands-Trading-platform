from __future__ import annotations

from datetime import datetime, timezone

from sqlalchemy import and_, func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.conversation import Conversation
from app.models.item import Item
from app.models.message import Message


class ConversationRepository:
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

    async def get_conversation_by_item_and_participants(
        self,
        item_id: int,
        buyer_id: int,
        seller_id: int,
    ) -> Conversation | None:
        stmt = select(Conversation).where(
            and_(
                Conversation.item_id == item_id,
                Conversation.buyer_id == buyer_id,
                Conversation.seller_id == seller_id,
            )
        )
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def create_conversation(self, item_id: int, buyer_id: int, seller_id: int) -> Conversation:
        conversation = Conversation(
            item_id=item_id,
            buyer_id=buyer_id,
            seller_id=seller_id,
            status=1,
        )
        self.session.add(conversation)
        await self.session.flush()
        await self.session.refresh(conversation)
        return conversation

    async def list_user_conversations(self, user_id: int, page: int, size: int) -> tuple[list[Conversation], int]:
        where_clause = or_(Conversation.buyer_id == user_id, Conversation.seller_id == user_id)

        total_stmt = select(func.count()).select_from(Conversation).where(where_clause)
        total_result = await self.session.execute(total_stmt)
        total = int(total_result.scalar_one() or 0)

        stmt = (
            select(Conversation)
            .where(where_clause)
            .order_by(Conversation.updated_at.desc())
            .offset((page - 1) * size)
            .limit(size)
        )
        result = await self.session.execute(stmt)
        return list(result.scalars().all()), total

    async def list_messages(self, conversation_id: int, page: int, size: int) -> tuple[list[Message], int]:
        where_clause = Message.conversation_id == conversation_id

        total_stmt = select(func.count()).select_from(Message).where(where_clause)
        total_result = await self.session.execute(total_stmt)
        total = int(total_result.scalar_one() or 0)

        stmt = (
            select(Message)
            .where(where_clause)
            .order_by(Message.created_at.asc())
            .offset((page - 1) * size)
            .limit(size)
        )
        result = await self.session.execute(stmt)
        return list(result.scalars().all()), total

    async def create_message(self, conversation_id: int, sender_id: int, content: str) -> Message:
        message = Message(
            conversation_id=conversation_id,
            sender_id=sender_id,
            content=content,
        )
        self.session.add(message)
        await self.session.flush()

        conversation = await self.get_conversation_by_id(conversation_id)
        if conversation is not None:
            conversation.updated_at = datetime.now(timezone.utc)
            await self.session.flush()

        await self.session.refresh(message)
        return message

    async def update_conversation_status(self, conversation: Conversation, status: int) -> Conversation:
        conversation.status = status
        await self.session.flush()
        await self.session.refresh(conversation)
        return conversation
