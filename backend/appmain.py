import app.config
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from app.api.routes import chat, khata
from pathlib import Path
import os

app = FastAPI(
    title="krishi.ai",
    description="AI Farming Assistant for Rural India",
    version="1.0.0"
)

# CORS — allow all origins since we serve from same domain
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API routes
app.include_router(chat.router,  prefix="/api")
app.include_router(khata.router, prefix="/api")

# Health check
@app.get("/api/health")
async def health():
    return {"status": "ok", "service": "kisaan-ai"}

# Serve React static files
# The frontend build lives next to the backend folder in the repo.
FRONTEND_BUILD = Path(__file__).resolve().parent.parent / "frontend" / "dist"

if FRONTEND_BUILD.exists():
    # Serve static assets (JS, CSS, images)
    app.mount(
        "/assets",
        StaticFiles(directory=str(FRONTEND_BUILD / "assets")),
        name="assets"
    )

    # Serve React app for all non-API routes
    @app.get("/{full_path:path}")
    async def serve_react(full_path: str):
        return FileResponse(FRONTEND_BUILD / "index.html")
else:
    @app.get("/")
    async def root():
        return {"message": "krishi.ai backend is running"}