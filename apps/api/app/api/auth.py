from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session, get_tx_session
from app.core.dependencies import get_current_user, oauth2_scheme
from app.core.response import success_response
from app.repositories.revoked_token_repository import RevokedTokenRepository
from app.repositories.user_repository import UserRepository
from app.schemas.auth import AuthLoginData, AuthLoginRequest, AuthRegisterData, AuthRegisterRequest, UserDTO
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register")
async def register(
    payload: AuthRegisterRequest,
    session: AsyncSession = Depends(get_tx_session),
):
    service = AuthService(UserRepository(session))
    user = await service.register(payload)
    data = AuthRegisterData(user=UserDTO.model_validate(user))
    return success_response(data=data.model_dump(by_alias=True))


@router.post("/login")
async def login(
    payload: AuthLoginRequest,
    session: AsyncSession = Depends(get_session),
):
    service = AuthService(UserRepository(session))
    token, user = await service.login(payload)
    data = AuthLoginData(token=token, user=UserDTO.model_validate(user))
    return success_response(data=data.model_dump(by_alias=True))


@router.get("/me")
async def me(current_user=Depends(get_current_user)):
    return success_response(data=UserDTO.model_validate(current_user).model_dump(by_alias=True))


@router.post("/logout")
async def logout(
    token: str = Depends(oauth2_scheme),
    session: AsyncSession = Depends(get_tx_session),
):
    service = AuthService(
        UserRepository(session),
        RevokedTokenRepository(session),
    )
    await service.logout(token)
    return success_response(data=None)
