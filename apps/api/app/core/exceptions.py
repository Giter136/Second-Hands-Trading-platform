from typing import Any

from app.core import error_codes


class AppException(Exception):
    def __init__(
        self,
        code: int,
        message: str,
        status_code: int = 400,
        data: Any = None,
    ) -> None:
        super().__init__(message)
        self.code = code
        self.message = message
        self.status_code = status_code
        self.data = data


class UnauthorizedException(AppException):
    def __init__(self, message: str = "unauthorized") -> None:
        super().__init__(
            code=error_codes.UNAUTHORIZED,
            message=message,
            status_code=401,
        )


class ForbiddenException(AppException):
    def __init__(self, message: str = "forbidden") -> None:
        super().__init__(
            code=error_codes.FORBIDDEN,
            message=message,
            status_code=403,
        )


class NotFoundException(AppException):
    def __init__(self, message: str = "not found") -> None:
        super().__init__(
            code=error_codes.NOT_FOUND,
            message=message,
            status_code=404,
        )


class ConflictException(AppException):
    def __init__(self, message: str = "state conflict") -> None:
        super().__init__(
            code=error_codes.STATE_CONFLICT,
            message=message,
            status_code=409,
        )
