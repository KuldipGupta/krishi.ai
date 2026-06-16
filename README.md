# Krishi.ai 🌾

**AI-powered farming assistant for Indian farmers**

Krishi.ai is an intelligent chatbot designed to support rural Indian farmers with real-time information on crop disease detection, weather forecasts, market prices (mandi), government schemes, and general farming guidance.

---

## 🌟 Features

- **🦠 Disease Detection**: AI-powered crop disease identification and remedies
- **🌤️ Weather Forecasts**: Real-time weather data for irrigation and planting decisions
- **💰 Mandi Prices**: Current market prices for crops in local mandis
- **📋 Government Schemes**: Information about PM Kisan, crop insurance, and other agricultural schemes
- **💬 Multilingual Support**: Support for Hindi and English communication
- **🤖 Intelligent Routing**: LangGraph-powered agentic system that intelligently routes queries
- **🔄 Fallback Model Support**: Automatic fallback to alternative Groq models if a model is deprecated

---

## 🛠️ Tech Stack

### Backend
- **Framework**: FastAPI (Python web framework)
- **Agent Framework**: LangGraph (agentic AI orchestration)
- **LLM**: Groq API with LangChain integration
- **Database**: Supabase (PostgreSQL)
- **Vector DB**: Chroma DB (for scheme embeddings)
- **API Gateway**: Uvicorn (ASGI server)

### Key Libraries
- `langchain` - LLM framework
- `langchain-core` - Core LangChain utilities
- `langchain-groq` - Groq integration
- `langgraph` - Agent orchestration
- `groq` - Groq API client
- `httpx` - HTTP client for weather API
- `pydantic` - Data validation
- `supabase` - Database client

---

## 📋 Prerequisites

- Python 3.12+
- Groq API Key ([Get one here](https://console.groq.com))
- Supabase Project URL and API Key (optional for production)
- Git

---

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/krishi-ai.git
cd krishi-ai
```

### 2. Create and Activate Virtual Environment
```bash
# Windows
python -m venv .venv
.venv\Scripts\activate

# macOS/Linux
python3 -m venv .venv
source .venv/bin/activate
```

### 3. Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 4. Set Environment Variables
Create a `.env` file in the `backend/` directory:

```env
# Groq Configuration
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama3-70b-8192
GROQ_MODEL_FALLBACKS=llama-3.1-8b-instant,mixtral-8x7b-32768,llama3-70b-8192

# Application
APP_ENV=development
FRONTEND_URL=http://localhost:5173

# Database (Optional)
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key

# Gemini (Optional)
GEMINI_API_KEY=your_gemini_key
```

### 5. Run the Backend Server
```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

---

## 📁 Project Structure

```
krishi-ai/
├── backend/
│   ├── app/
│   │   ├── agent/
│   │   │   ├── graph.py           # LangGraph workflow definition
│   │   │   ├── state.py           # Agent state schema
│   │   │   ├── supervisor.py      # Routing logic
│   │   │   └── synthesizer.py     # Response generation
│   │   ├── api/
│   │   │   └── routes.py          # Chat API endpoints
│   │   ├── models/
│   │   │   └── schemas.py         # Pydantic schemas
│   │   ├── tools/
│   │   │   ├── disease_detection.py
│   │   │   ├── general_chat.py
│   │   │   ├── mandi_price.py
│   │   │   ├── schemes_rag.py
│   │   │   └── weather.py
│   │   ├── services/
│   │   │   ├── embeddings.py
│   │   │   ├── language.py        # Groq LLM helper with fallbacks
│   │   │   ├── voice.py
│   │   │   └── database.py
│   │   ├── memory/
│   │   │   ├── short_term.py
│   │   │   └── long_term.py
│   │   ├── config.py              # Configuration management
│   │   └── main.py                # FastAPI app initialization
│   ├── data/
│   │   ├── chroma_db/             # Vector store for schemes
│   │   └── schemes/               # Scheme documents
│   ├── requirements.txt           # Python dependencies
│   └── .env                       # Environment variables
├── frontend/                      # (React/Vue frontend)
├── scripts/
│   ├── ingest_schemes.py          # RAG ingestion
│   └── test_agent.py              # Testing utilities
└── README.md
```

---

## 🔌 API Endpoints

### Health Check
```http
GET /api/health
```
Response:
```json
{
  "status": "ok",
  "service": "krishi-ai-backend"
}
```

### Chat Endpoint
```http
POST /api/chat
```

**Request Body:**
```json
{
  "session_id": "user_123",
  "message": "मेरी फसल में पत्तियों पर धब्बे दिख रहे हैं",
  "language": "hi",
  "location": {
    "city": "Lucknow"
  },
  "image_base64": null
}
```

**Response:**
```json
{
  "reply": "आपकी फसल को संभवतः फंगल संक्रमण हुआ है। नीम के तेल का छिड़काव करें...",
  "tool_used": "disease",
  "session_id": "user_123"
}
```

---

## 🤖 How It Works

### Agent Flow

```
User Query
    ↓
Supervisor (Router)
    ├─→ Disease Detection Tool
    ├─→ Weather Tool
    ├─→ Mandi Prices Tool
    ├─→ Schemes Tool (RAG)
    └─→ General Chat Tool
    ↓
Tool Processing
    ↓
Synthesizer (Response Generation)
    ↓
Farmer-Friendly Reply
```

### Key Components

1. **Supervisor Node**: Routes incoming queries to the appropriate tool
2. **Tool Nodes**: Execute specific farming tasks
3. **Synthesizer Node**: Converts tool outputs to warm, actionable farmer-friendly responses
4. **LLM Service**: Centralized Groq integration with automatic fallback support

---

## 🌍 Supported Languages

- **Hindi (हिंदी)** - Primary language for Indian farmers
- **English** - Secondary language support

---

## 🔑 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `GROQ_API_KEY` | Your Groq API key | `gsk_XXX...` |
| `GROQ_MODEL` | Primary LLM model | `llama3-70b-8192` |
| `GROQ_MODEL_FALLBACKS` | Fallback models (comma-separated) | `llama-3.1-8b-instant,mixtral-8x7b-32768` |
| `APP_ENV` | Environment (development/production) | `development` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |
| `SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` |
| `SUPABASE_KEY` | Supabase API key | `eyJxxx...` |

---

## 🧪 Testing

### Test with curl
```bash
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "test123",
    "message": "aaj mausam kaisa hai",
    "language": "hi",
    "location": {"city": "Lucknow"}
  }'
```

### Using Python script
```python
import requests

response = requests.post(
    "http://localhost:8000/api/chat",
    json={
        "session_id": "test123",
        "message": "मेरी गेहूं की फसल कैसी है",
        "language": "hi",
        "location": {"city": "Delhi"}
    }
)

print(response.json())
```

---

## 🐛 Troubleshooting

### ImportError: No module named 'langchain_core'
```bash
pip install -r requirements.txt
```

### Groq Model Decommissioned Error
The fallback mechanism automatically tries alternate models. Ensure `GROQ_MODEL_FALLBACKS` is set correctly in `.env`:
```env
GROQ_MODEL_FALLBACKS=llama-3.1-8b-instant,mixtral-8x7b-32768,llama3-70b-8192
```

### API Not Responding
- Check that backend is running: `http://localhost:8000/api/health`
- Verify CORS is configured correctly in `app/main.py`
- Check `.env` file for missing API keys

---

## 📦 Dependencies

All dependencies are listed in `backend/requirements.txt`. Key packages:

```
fastapi==0.136.3
uvicorn==0.49.0
langchain==1.3.6
langchain-core==1.4.3
langchain-groq==1.1.3
langgraph==1.2.4
groq==0.37.1
pydantic==2.13.4
python-dotenv==1.2.2
supabase==2.31.0
chromadb==1.5.9
httpx==0.28.1
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- Built with ❤️ for Indian farmers
- Powered by [Groq](https://groq.com) for fast LLM inference
- Agent orchestration by [LangGraph](https://langchain-ai.github.io/langgraph/)
- Database by [Supabase](https://supabase.com)

---

## 📧 Contact & Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing documentation in `/docs`
- Contact the development team

---

## 🚀 Roadmap

- [ ] Voice input/output support
- [ ] Crop recommendation based on weather and soil
- [ ] Direct integration with farmer cooperatives
- [ ] SMS/WhatsApp interface
- [ ] Offline mode support
- [ ] Real-time pest alerts
- [ ] Soil health monitoring

---

**Happy Farming! 🌾**

Made with 🌱 for Krishi (Agriculture)
