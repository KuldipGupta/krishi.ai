from app.agent.state import AgentState
from langchain_core.messages import HumanMessage, SystemMessage
from appserviceslanguage import invoke_groq_with_fallbacks

SUPERVISOR_PROMPT = """You are a routing assistant. Read the farmer's message and reply with ONLY one word from this list:

- disease     → farmer mentions crop disease, pest, yellowing, spots, insects, damage, or sends a photo
- weather     → farmer asks about rain, weather, temperature, irrigation timing
- mandi       → farmer asks about price, rate, mandi, market, sell, crop value
- schemes     → farmer asks about government scheme, subsidy, loan, PM Kisan, registration
- general     → everything else

Reply with ONLY that one word. No explanation. No punctuation. Just the word."""


def classify_message(message: str) -> str:
    msg = (message or "").lower()

    disease_keywords = [
        "रोग",
        "कीड़ा",
        "कीड़े",
        "कीड़े",
        "bimari",
        "bemaari",
        "fungus",
        "spots",
        "leaf",
        "yellowing",
        "infection",
        "photo",
    ]
    weather_keywords = [
        "बारिश", "मौसम", "mausam", "baarish", "तापमान", "tapmaan", "rain", "temperature", "weather",
        "बादल", "badal", "बरसात", "barsaat", "humidity", "धूप", "dhoop",
    ]
    mandi_keywords = ["मंडी", "price", "rate", "भाव", "बाजार", "sell", "बेच", "आढ़त"]
    scheme_keywords = ["scheme", "schemes", "subsidy", "loan", "pm kisan", "किसान सम्मान", "बीमा", "registration"]
    general_keywords = ["खाद", "उर्वरक", "बीज", "बुवाई", "सिंचाई", "कटाई", "फसल", "खेत", "कब देना", "कब दें", "कब दे"]

    if any(keyword in msg for keyword in disease_keywords):
        return "disease"
    if any(keyword in msg for keyword in weather_keywords):
        return "weather"
    if any(keyword in msg for keyword in mandi_keywords):
        return "mandi"
    if any(keyword in msg for keyword in scheme_keywords):
        return "schemes"
    if any(keyword in msg for keyword in general_keywords):
        return "general"

    return "general"


def supervisor_node(state: AgentState) -> AgentState:
    decision = classify_message(state.get("message", ""))

    state["tool_to_use"] = decision
    return state