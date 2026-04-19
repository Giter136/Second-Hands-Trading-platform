from datetime import datetime, timezone
from typing import Optional

from app.core.exceptions import ConflictException, ForbiddenException, UnauthorizedException
from app.core.security import create_access_token, decode_access_token, hash_password, verify_password
from app.models.user import User
from app.repositories.revoked_token_repository import RevokedTokenRepository
from app.repositories.user_repository import UserRepository
from app.schemas.auth import AuthLoginRequest, AuthRegisterRequest


class AuthService:
    def __init__(
        self,
        user_repository: UserRepository,
        revoked_token_repository: Optional[RevokedTokenRepository] = None,
    ) -> None:
        self.user_repository = user_repository
        self.revoked_token_repository = revoked_token_repository

    async def register(self, payload: AuthRegisterRequest) -> User:
        phone_exists = await self.user_repository.get_by_phone(payload.phone)
        if phone_exists is not None:
            raise ConflictException("phone already exists")

        nickname_exists = await self.user_repository.get_by_nickname(payload.nickname)
        if nickname_exists is not None:
            raise ConflictException("nickname already exists")

        password_hash = hash_password(payload.password_hash)
        return await self.user_repository.create(
            phone=payload.phone,
            password_hash=password_hash,
            nickname=payload.nickname,
        )

    async def login(self, payload: AuthLoginRequest) -> tuple[str, User]:
        account = payload.phone or payload.username
        if account is None:
            raise UnauthorizedException("账号或密码错误")

        user = None
        if payload.phone:
            user = await self.user_repository.get_by_phone(payload.phone)
            # 兼容旧前端把“用户名”误放在 phone 字段里的请求体。
            if user is None and not payload.username:
                user = await self.user_repository.get_by_nickname(payload.phone)

        if user is None and payload.username:
            user = await self.user_repository.get_by_nickname(payload.username)

        if user is None:
            raise UnauthorizedException("账号或密码错误")

        if not verify_password(payload.password_hash, user.password_hash):
            raise UnauthorizedException("账号或密码错误")

        if user.status != 1:
            raise ForbiddenException("账号已被冻结")

        token = create_access_token(
            {
                "sub": str(user.id),
                "role": user.role,
            }
        )
        return token, user

    async def logout(self, token: str) -> None:
        if self.revoked_token_repository is None:
            raise UnauthorizedException("token invalid")

        payload = decode_access_token(token)
        exp = payload.get("exp")
        expires_at = None
        if isinstance(exp, (int, float)):
            expires_at = datetime.fromtimestamp(exp, tz=timezone.utc)

        await self.revoked_token_repository.revoke(token=token, expires_at=expires_at)
