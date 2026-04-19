from __future__ import annotations

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session, get_tx_session
from app.core.dependencies import get_current_user
from app.core.response import success_response
from app.models.user import User
from app.repositories.conversation_repository import ConversationRepository
from app.schemas.conversation import (
    ConversationCreateRequest,
    ConversationListData,
    MessageCreateRequest,
    MessageListData,
)
from app.services.conversation_service import ConversationService

router = APIRouter(prefix="/conversations", tags=["conversations"])


@router.get("")
async def get_my_conversations(
    page: int = Query(default=1, ge=1),
    size: int = Query(default=20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    service = ConversationService(ConversationRepository(session))
    conversations, total = await service.list_my_conversations(current_user=current_user, page=page, size=size)
    data = ConversationListData(conversations=conversations, total=total)
    return success_response(data=data.model_dump(by_alias=True))


@router.post("")
async def start_conversation(
    payload: ConversationCreateRequest,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_tx_session),
):
    service = ConversationService(ConversationRepository(session))
    conversation = await service.create_or_get_conversation(current_user=current_user, payload=payload)
    return success_response(data=conversation.model_dump(by_alias=True))


@router.get("/{conversation_id}/messages")
async def get_conversation_messages(
    conversation_id: int,
    page: int = Query(default=1, ge=1),
    size: int = Query(default=50, ge=1, le=200),
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    service = ConversationService(ConversationRepository(session))
    messages, total = await service.list_messages(
        current_user=current_user,
        conversation_id=conversation_id,
        page=page,
        size=size,
    )
    data = MessageListData(messages=messages, total=total)
    return success_response(data=data.model_dump(by_alias=True))


@router.post("/{conversation_id}/messages")
async def post_message(
    conversation_id: int,
    payload: MessageCreateRequest,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_tx_session),
):
    service = ConversationService(ConversationRepository(session))
    message = await service.send_message(current_user=current_user, conversation_id=conversation_id, payload=payload)
    return success_response(data=message.model_dump(by_alias=True))
