# health.py
# A simple endpoint that deployment platforms ping to check if our server is alive.
# Render.com, for example, hits /health every 30 seconds.

from fastapi import APIRouter

router = APIRouter()

@router.get("/health")
async def health_check():
    return {"status": "ok", "service": "krishi-ai-backend"}