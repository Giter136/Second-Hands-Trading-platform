from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.router import api_router
from app.core.config import get_settings
from app.core.database import init_models
from app.core.handlers import register_exception_handlers
from app.core.response import success_response

settings = get_settings()

app = FastAPI(
    title=settings.app_name,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

register_exception_handlers(app)


@app.on_event("startup")
async def on_startup() -> None:
    if settings.auto_create_tables:
        await init_models()


@app.get("/health")
async def health() -> dict:
    return success_response(data={"status": "ok"})


app.include_router(api_router, prefix=settings.api_prefix)
