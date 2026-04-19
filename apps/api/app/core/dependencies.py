from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.core.exceptions import ForbiddenException, UnauthorizedException
from app.core.security import decode_access_token
from app.repositories.revoked_token_repository import RevokedTokenRepository
from app.repositories.user_repository import UserRepository

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    session: AsyncSession = Depends(get_session),
):
    revoked_token_repository = RevokedTokenRepository(session)
    if await revoked_token_repository.is_revoked(token):
        raise UnauthorizedException("token invalid")

    payload = decode_access_token(token)
    subject = payload.get("sub")
    if subject is None:
        raise UnauthorizedException("token invalid")

    try:
        user_id = int(subject)
    except (TypeError, ValueError) as exc:
        raise UnauthorizedException("token invalid") from exc

    user_repository = UserRepository(session)
    user = await user_repository.get_by_id(user_id)
    if user is None:
        raise UnauthorizedException("user not found")
    if user.status != 1:
        raise ForbiddenException("账号已被冻结")
    return user


async def get_current_admin(current_user=Depends(get_current_user)):
    if current_user.role != 1:
        raise ForbiddenException("admin only")
    return current_user
