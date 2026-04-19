from __future__ import annotations

from datetime import datetime

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import hash_token
from app.models.revoked_token import RevokedToken


class RevokedTokenRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def is_revoked(self, token: str) -> bool:
        digest = hash_token(token)
        stmt = select(RevokedToken.id).where(RevokedToken.token_digest == digest)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none() is not None

    async def revoke(self, token: str, expires_at: datetime | None) -> RevokedToken | None:
        digest = hash_token(token)
        stmt = select(RevokedToken).where(RevokedToken.token_digest == digest)
        result = await self.session.execute(stmt)
        exists = result.scalar_one_or_none()
        if exists is not None:
            return None

        revoked = RevokedToken(
            token_digest=digest,
            revoked_at=datetime.utcnow(),
            expires_at=expires_at,
        )
        self.session.add(revoked)
        await self.session.flush()
        await self.session.refresh(revoked)
        return revoked
