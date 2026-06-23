from dotenv import load_dotenv
import os

load_dotenv()
TAVILY_API_KEY = os.getenv("TAVILY_API_KEY")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
APP_ENV = os.getenv("APP_ENV", "development")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
GROQ_MODEL = os.getenv("GROQ_MODEL", "llama3-70b-8192")
GROQ_MODEL_FALLBACKS = [
	model.strip()
	for model in os.getenv(
		"GROQ_MODEL_FALLBACKS",
		"llama-3.1-8b-instant,mixtral-8x7b-32768,llama3-70b-8192",
	).split(",")
	if model.strip()
]