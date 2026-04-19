from __future__ import annotations

from app.core.exceptions import ConflictException, ForbiddenException, NotFoundException
from app.models.user import User
from app.repositories.conversation_repository import ConversationRepository
from app.schemas.conversation import (
    ConversationCreateRequest,
    ConversationDTO,
    MessageCreateRequest,
    MessageDTO,
)


class ConversationService:
    def __init__(self, conversation_repository: ConversationRepository) -> None:
        self.conversation_repository = conversation_repository

    async def list_my_conversations(self, current_user: User, page: int, size: int) -> tuple[list[ConversationDTO], int]:
        conversations, total = await self.conversation_repository.list_user_conversations(
            user_id=current_user.id,
            page=page,
            size=size,
        )

        dto_rows: list[ConversationDTO] = []
        for conversation in conversations:
            item = await self.conversation_repository.get_item_by_id(conversation.item_id)
            item_data = None
            if item is not None:
                item_data = {
                    "id": item.id,
                    "title": item.title,
                    "price": float(item.price),
                    "status": item.status,
                }

            dto_rows.append(
                ConversationDTO.model_validate(
                    {
                        **conversation.__dict__,
                        "item": item_data,
                    }
                )
            )

        return dto_rows, total

    async def create_or_get_conversation(self, current_user: User, payload: ConversationCreateRequest) -> ConversationDTO:
        item = await self.conversation_repository.get_item_by_id(payload.item_id)
        if item is None:
            raise NotFoundException("item not found")
        if item.seller_id == current_user.id:
            raise ForbiddenException("seller cannot create conversation as buyer")
        if item.status not in (1, 2):
            raise ConflictException("item is not available for conversation")

        conversation = await self.conversation_repository.get_conversation_by_item_and_participants(
            item_id=item.id,
            buyer_id=current_user.id,
            seller_id=item.seller_id,
        )
        if conversation is None:
            conversation = await self.conversation_repository.create_conversation(
                item_id=item.id,
                buyer_id=current_user.id,
                seller_id=item.seller_id,
            )

        return ConversationDTO.model_validate(
            {
                **conversation.__dict__,
                "item": {
                    "id": item.id,
                    "title": item.title,
                    "price": float(item.price),
                    "status": item.status,
                },
            }
        )

    async def list_messages(
        self,
        current_user: User,
        conversation_id: int,
        page: int,
        size: int,
    ) -> tuple[list[MessageDTO], int]:
        conversation = await self.conversation_repository.get_conversation_by_id(conversation_id)
        if conversation is None:
            raise NotFoundException("conversation not found")
        self._assert_participant(current_user=current_user, buyer_id=conversation.buyer_id, seller_id=conversation.seller_id)

        messages, total = await self.conversation_repository.list_messages(conversation_id=conversation_id, page=page, size=size)
        dto_rows = [MessageDTO.model_validate(message) for message in messages]
        return dto_rows, total

    async def send_message(self, current_user: User, conversation_id: int, payload: MessageCreateRequest) -> MessageDTO:
        conversation = await self.conversation_repository.get_conversation_by_id(conversation_id)
        if conversation is None:
            raise NotFoundException("conversation not found")
        self._assert_participant(current_user=current_user, buyer_id=conversation.buyer_id, seller_id=conversation.seller_id)

        if conversation.status != 1:
            raise ConflictException("conversation is closed")

        item = await self.conversation_repository.get_item_by_id(conversation.item_id)
        if item is not None and item.status == 3:
            raise ConflictException("item already sold, conversation is read-only")

        message = await self.conversation_repository.create_message(
            conversation_id=conversation.id,
            sender_id=current_user.id,
            content=payload.content,
        )
        return MessageDTO.model_validate(message)

    @staticmethod
    def _assert_participant(current_user: User, buyer_id: int, seller_id: int) -> None:
        if current_user.id not in (buyer_id, seller_id):
            raise ForbiddenException("no permission for this conversation")
