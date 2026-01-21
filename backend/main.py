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


class ConversationHistoryItem(BaseModel):
    """A single item in the conversation history."""

    role: str  # "user" or "assistant"
    content: str
    imageUrl: Optional[str] = None  # Optional image URL for this message


class GenerateRequest(BaseModel):
    """Request model for /api/generate endpoint."""

    prompt: str
    image: Optional[ImageData] = None
    conversationHistory: Optional[list[ConversationHistoryItem]] = None


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
    messages: list[dict[str, str]] = []
    all_images: list[bytes] = []

    # Process conversation history if provided
    if request.conversationHistory:
        for item in request.conversationHistory:
            messages.append({"role": item.role, "content": item.content})

            # Fetch image if imageUrl is present
            if item.imageUrl:
                history_image_bytes = await fetch_image_from_url(item.imageUrl)
                all_images.append(history_image_bytes)

    # Process current image if provided
    current_image_bytes: bytes | None = None
    if request.image:
        if request.image.type == "base64":
            current_image_bytes = decode_base64_image(request.image.data)
        elif request.image.type == "url":
            current_image_bytes = await fetch_image_from_url(request.image.data)

    if current_image_bytes:
        all_images.append(current_image_bytes)

    # Add current prompt as final user message
    messages.append({"role": "user", "content": request.prompt})

    # Prepare images list for ollama_client (None if empty)
    images = all_images if all_images else None

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
