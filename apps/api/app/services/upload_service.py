from pathlib import Path
from uuid import uuid4

from fastapi import UploadFile

from app.core.exceptions import ConflictException, UnsupportedMediaTypeException


class UploadService:
    ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp"}
    MAX_FILE_SIZE = 5 * 1024 * 1024

    def __init__(self, upload_root: Path) -> None:
        self.upload_root = upload_root
        self.upload_root.mkdir(parents=True, exist_ok=True)

    async def save_image(self, upload_file: UploadFile) -> str:
        if upload_file.content_type not in self.ALLOWED_CONTENT_TYPES:
            raise UnsupportedMediaTypeException("unsupported image type")

        content = await upload_file.read()
        if len(content) == 0:
            raise ConflictException("empty file")
        if len(content) > self.MAX_FILE_SIZE:
            raise ConflictException("file too large")

        ext = self._guess_ext(upload_file.content_type)
        filename = f"{uuid4().hex}{ext}"
        file_path = self.upload_root / filename
        file_path.write_bytes(content)

        return f"/uploads/images/{filename}"

    @staticmethod
    def _guess_ext(content_type: str) -> str:
        if content_type == "image/jpeg":
            return ".jpg"
        if content_type == "image/png":
            return ".png"
        return ".webp"
