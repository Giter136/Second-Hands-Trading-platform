from pathlib import Path

from fastapi import APIRouter, File, UploadFile

from app.core.response import success_response
from app.schemas.upload import UploadImageData
from app.services.upload_service import UploadService

router = APIRouter(prefix="/upload", tags=["upload"])


@router.post("/image")
async def upload_image(file: UploadFile = File(...)):
    service = UploadService(Path("uploads/images"))
    image_url = await service.save_image(file)
    data = UploadImageData(url=image_url)
    return success_response(data=data.model_dump(by_alias=True))
