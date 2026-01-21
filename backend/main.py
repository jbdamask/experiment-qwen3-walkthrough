"""FastAPI backend for Qwen3-VL vision-language model via Ollama."""

import uuid
from typing import Optional

from fastapi import FastAPI
from pydantic import BaseModel

from image_processor import decode_base64_image, fetch_image_from_url
from ollama_client import generate_completion


app = FastAPI(title="Qwen3-VL Backend")


class ImageData(BaseModel):
    """Image data with type and data fields."""

    type: str  # "base64" or "url"
    data: str  # base64 data URL or URL string


class GenerateRequest(BaseModel):
    """Request model for /api/generate endpoint."""

    prompt: str
    image: Optional[ImageData] = None
    conversationHistory: Optional[list] = None


class UsageInfo(BaseModel):
    """Token usage information."""

    prompt_tokens: int
    completion_tokens: int
    total_tokens: int


class GenerateResponse(BaseModel):
    """Response model for /api/generate endpoint."""

    id: str
    content: str
    usage: UsageInfo


@app.post("/api/generate", response_model=GenerateResponse)
async def generate(request: GenerateRequest) -> GenerateResponse:
    """Generate a response using the vision-language model.

    Args:
        request: The generation request with prompt and optional image

    Returns:
        Generated response with content and usage info
    """
    # Process image if provided
    image_bytes: bytes | None = None
    if request.image:
        if request.image.type == "base64":
            image_bytes = decode_base64_image(request.image.data)
        elif request.image.type == "url":
            image_bytes = await fetch_image_from_url(request.image.data)

    # Build messages list
    messages = [{"role": "user", "content": request.prompt}]

    # Prepare images list for ollama_client
    images = [image_bytes] if image_bytes else None

    # Call Ollama
    result = await generate_completion(messages, images)

    # Map response to our format
    prompt_tokens = result.get("prompt_eval_count", 0)
    completion_tokens = result.get("eval_count", 0)

    return GenerateResponse(
        id=str(uuid.uuid4()),
        content=result["content"],
        usage=UsageInfo(
            prompt_tokens=prompt_tokens,
            completion_tokens=completion_tokens,
            total_tokens=prompt_tokens + completion_tokens,
        ),
    )
