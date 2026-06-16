# schemes_rag.py — stub for now, real implementation Day 5
from app.agent.state import AgentState

def schemes_rag_tool(state: AgentState) -> AgentState:
    state["tool_result"] = "Government schemes RAG tool coming soon."
    return state