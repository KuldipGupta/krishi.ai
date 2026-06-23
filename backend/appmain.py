from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import chat

app = FastAPI(
    title="krishi.ai",
    description="AI Farming Assistant for Rural India",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    """Initialize RAG and ChromaDB on server startup"""
    try:
        from appservicesembeddings import get_vectorstore
        print("🚀 Initializing RAG and ChromaDB...")
        get_vectorstore()
        print("✅ RAG & ChromaDB Ready!")
    except Exception as e:
        print(f"⚠️ RAG initialization warning: {e}")

@app.get("/")
async def root():
    return {"message": "krishi.ai backend is running"}

@app.get("/api/health")
async def health():
    return {"status": "ok", "service": "krishi.ai"}

# Register chat route
app.include_router(chat.router, prefix="/api")