import io
from PIL import Image
from fastapi import HTTPException, UploadFile, status
from app.core.config import settings

ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"]
ALLOWED_FORMATS = ["JPEG", "PNG", "WEBP"]

async def validate_uploaded_image(file: UploadFile) -> bytes:
    """
    Validates uploaded file size and inspects actual image byte content
    using Pillow to avoid trusting file extensions or MIME headers.
    """
    if not file:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No image file provided."
        )

    # Read bytes into memory
    content = await file.read()
    
    # 1. Size check
    max_bytes = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024
    if len(content) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The uploaded image file is empty."
        )
    if len(content) > max_bytes:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"Image size exceeds the maximum limit of {settings.MAX_UPLOAD_SIZE_MB}MB."
        )

    # 2. Content & Header Inspection (Pillow verification)
    try:
        image = Image.open(io.BytesIO(content))
        image.verify()  # Verifies image header & structure without decoding full data
        
        # Check actual format recognized by PIL
        if image.format.upper() not in ALLOWED_FORMATS:
            raise HTTPException(
                status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
                detail=f"Unsupported image format: {image.format}. Please upload a JPEG, PNG, or WebP image."
            )
            
        # Re-open to verify dimensions (since verify() closes the image)
        image = Image.open(io.BytesIO(content))
        width, height = image.size
        if width < 32 or height < 32:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Image resolution too low ({width}x{height}px). Minimum supported dimension is 32x32px."
            )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Corrupt or invalid image file. Content could not be decoded: {str(e)}"
        )

    return content
