import logging

from fastapi import HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from app.core import error_codes
from app.core.exceptions import AppException
from app.core.response import error_response

logger = logging.getLogger(__name__)


def _safe_validation_errors(exc: RequestValidationError) -> list[dict]:
    safe_errors: list[dict] = []
    for error in exc.errors():
        if not isinstance(error, dict):
            continue

        ctx = error.get("ctx")
        if isinstance(ctx, dict) and isinstance(ctx.get("error"), Exception):
            ctx = {**ctx, "error": str(ctx["error"])}
            error = {**error, "ctx": ctx}

        safe_errors.append(error)

    return safe_errors


def register_exception_handlers(app) -> None:
    @app.exception_handler(AppException)
    async def handle_app_exception(_: Request, exc: AppException) -> JSONResponse:
        return JSONResponse(
            status_code=exc.status_code,
            content=error_response(code=exc.code, message=exc.message, data=exc.data),
        )

    @app.exception_handler(RequestValidationError)
    async def handle_validation_exception(_: Request, exc: RequestValidationError) -> JSONResponse:
        return JSONResponse(
            status_code=422,
            content=error_response(
                code=error_codes.INVALID_PARAMS,
                message="invalid params",
                data=_safe_validation_errors(exc),
            ),
        )

    @app.exception_handler(HTTPException)
    async def handle_http_exception(_: Request, exc: HTTPException) -> JSONResponse:
        code = error_codes.INTERNAL_ERROR
        if exc.status_code == 401:
            code = error_codes.UNAUTHORIZED
        elif exc.status_code == 403:
            code = error_codes.FORBIDDEN
        elif exc.status_code == 404:
            code = error_codes.NOT_FOUND

        return JSONResponse(
            status_code=exc.status_code,
            content=error_response(code=code, message=str(exc.detail)),
        )

    @app.exception_handler(Exception)
    async def handle_unexpected_exception(_: Request, exc: Exception) -> JSONResponse:
        logger.exception("Unhandled exception", exc_info=exc)
        return JSONResponse(
            status_code=500,
            content=error_response(
                code=error_codes.INTERNAL_ERROR,
                message="internal server error",
            ),
        )
