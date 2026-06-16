# general_chat.py
# Handles general farming questions not covered by other tools.
# Also serves as the fallback when routing is unclear.

from app.agent.state import AgentState
from langchain_core.messages import HumanMessage, SystemMessage
from appserviceslanguage import invoke_groq_with_fallbacks
import groq


def invoke_with_fallbacks(messages):
    return invoke_groq_with_fallbacks(messages, temperature=0.4)

def general_chat_tool(state: AgentState) -> AgentState:
    response_text, used_model, error = invoke_with_fallbacks([
        SystemMessage(content="You are an expert farming assistant for Indian farmers. Answer clearly and practically."),
        HumanMessage(content=state["message"]) 
    ])

    if response_text is None:
        if error is not None and isinstance(error, groq.NotFoundError):
            state["tool_result"] = (
                "AI model not found or not accessible. Set a valid GROQ_MODEL or GROQ_MODEL_FALLBACKS "
                "in backend/.env."
            )
        else:
            state["tool_result"] = "AI service error."
    else:
        state["tool_result"] = response_text
    return state