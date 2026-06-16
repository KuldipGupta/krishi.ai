# mandi_price.py — stub for now, real implementation Day 4
from app.agent.state import AgentState

def mandi_price_tool(state: AgentState) -> AgentState:
    state["tool_result"] = "Mandi price tool coming soon."
    return state