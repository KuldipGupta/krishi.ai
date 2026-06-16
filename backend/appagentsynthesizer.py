from app.agent.state import AgentState
from langchain_core.messages import HumanMessage, SystemMessage
from appserviceslanguage import invoke_groq_with_fallbacks

SYNTHESIZER_PROMPT = """You are Krishi.ai, a friendly farming assistant for Indian farmers.

You will receive raw data from a tool. Convert it into a warm, helpful reply.

Rules:
- Reply in the same language the farmer used
- Use simple words, no technical jargon
- Be warm and respectful
- Give concrete actionable advice
- Keep reply under 120 words

Farmer's question: {message}
Tool used: {tool_used}
Raw data: {tool_result}"""

def synthesizer_node(state: AgentState) -> AgentState:
    prompt = SYNTHESIZER_PROMPT.format(
        message=state["message"],
        tool_used=state.get("tool_to_use", "general"),
        tool_result=state.get("tool_result", "No data available")
    )

    response_text, _, _ = invoke_groq_with_fallbacks(
        [
            SystemMessage(content=prompt),
            HumanMessage(content="Generate the farmer friendly response now."),
        ],
        temperature=0.4,
    )

    state["final_reply"] = response_text.strip() if response_text else "माफ करें, कुछ गड़बड़ हो गई।"
    return state