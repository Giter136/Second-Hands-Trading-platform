from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.api.router import api_router
from app.core.config import get_settings
from app.core.database import AsyncSessionFactory, init_models
from app.core.handlers import register_exception_handlers
from app.core.response import success_response
from app.core.security import hash_password, verify_password
from app.repositories.user_repository import UserRepository

settings = get_settings()
Path("uploads/images").mkdir(parents=True, exist_ok=True)

app = FastAPI(
    title=settings.app_name,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_origin_regex=settings.cors_origin_regex_effective,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

register_exception_handlers(app)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")


async def ensure_default_admin() -> None:
    async with AsyncSessionFactory() as session:
        user_repository = UserRepository(session)
        admin_user = await user_repository.get_by_phone("114514")

        if admin_user is None:
            admin_user = await user_repository.create(
                phone="114514",
                password_hash=hash_password("123456"),
                nickname="admin",
            )

        password_ok = False
        try:
            password_ok = verify_password("123456", admin_user.password_hash)
        except Exception:
            password_ok = False

        admin_user.nickname = "admin"
        admin_user.role = 1
        admin_user.status = 1
        if not password_ok:
            admin_user.password_hash = hash_password("123456")

        await session.commit()


@app.on_event("startup")
async def on_startup() -> None:
    if settings.auto_create_tables:
        await init_models()
    await ensure_default_admin()


@app.get("/health")
async def health() -> dict:
    return success_response(data={"status": "ok"})


app.include_router(api_router, prefix=settings.api_prefix)
