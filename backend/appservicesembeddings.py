# embeddings.py
# Real RAG using Gemini embeddings API
# No local model download needed - runs on Google's servers

from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_chroma import Chroma
from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from app.config import GEMINI_API_KEY
import os

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
SCHEMES_PATHS = [
    os.path.join(BASE_DIR, "dataschemes", "schemes.txt"),
    os.path.join(BASE_DIR, "data", "schemes", "schemes.txt"),
]
CHROMA_PATH = os.path.join(BASE_DIR, "data", "chroma_db")

embeddings = None
vectorstore = None


def get_embeddings():
    global embeddings
    if embeddings is None:
        embeddings = GoogleGenerativeAIEmbeddings(
            model="models/embedding-001",
            google_api_key=GEMINI_API_KEY
        )
    return embeddings

def get_vectorstore():
    global vectorstore

    if vectorstore is not None:
        return vectorstore

    schemes_path = next((path for path in SCHEMES_PATHS if os.path.exists(path)), None)
    if schemes_path is None:
        raise FileNotFoundError(f"Schemes file not found: {SCHEMES_PATHS[0]} or {SCHEMES_PATHS[1]}")

    current_embeddings = get_embeddings()

    # If already exists, load it
    if os.path.exists(CHROMA_PATH) and os.listdir(CHROMA_PATH):
        print("Loading existing ChromaDB...")
        vectorstore = Chroma(
            persist_directory=CHROMA_PATH,
            embedding_function=current_embeddings
        )
        return vectorstore

    print("Creating ChromaDB for first time...")

    # Load schemes text file
    loader = TextLoader(schemes_path, encoding="utf-8")
    documents = loader.load()

    # Split into chunks
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50
    )
    chunks = splitter.split_documents(documents)
    print(f"Created {len(chunks)} chunks")

    # Create vector store
    vectorstore = Chroma.from_documents(
        documents=chunks,
        embedding=current_embeddings,
        persist_directory=CHROMA_PATH
    )

    print("ChromaDB ready")
    return vectorstore

def get_relevant_schemes(query: str) -> str:
    """Search ChromaDB for relevant scheme information"""
    try:
        current_vectorstore = get_vectorstore()
        
        results = current_vectorstore.similarity_search(query, k=3)
        if not results:
            return "Koi relevant scheme nahi mili. PM Kisan, Fasal Bima, KCC ke baare mein poochh sakte hain."

        # Combine top 3 results
        combined = "\n\n".join([doc.page_content for doc in results])
        return combined

    except Exception as e:
        return "Scheme information abhi available nahi hai. Baad mein try karein."