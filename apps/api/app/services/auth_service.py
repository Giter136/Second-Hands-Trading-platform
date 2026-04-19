from app.core.exceptions import ConflictException, ForbiddenException, UnauthorizedException
from app.core.security import create_access_token, hash_password, verify_password
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.auth import AuthLoginRequest, AuthRegisterRequest


class AuthService:
    def __init__(self, user_repository: UserRepository) -> None:
        self.user_repository = user_repository

    async def register(self, payload: AuthRegisterRequest) -> User:
        exists = await self.user_repository.get_by_phone(payload.phone)
        if exists is not None:
            raise ConflictException("phone already exists")

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

        user = await self.user_repository.get_by_phone(account)
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
