from fastapi import APIRouter

from app.api.admin import router as admin_router
from app.api.auth import router as auth_router
from app.api.conversations import router as conversations_router
from app.api.items import router as items_router
from app.api.trades import router as trades_router
from app.api.upload import router as upload_router

api_router = APIRouter()
api_router.include_router(auth_router)
api_router.include_router(items_router)
api_router.include_router(conversations_router)
api_router.include_router(trades_router)
api_router.include_router(upload_router)
api_router.include_router(admin_router)
