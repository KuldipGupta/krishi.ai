# weather.py — stub for now, real implementation Day 3
from app.agent.state import AgentState

def weather_tool(state: AgentState) -> AgentState:
    state["tool_result"] = "Weather tool coming soon. Location: " + str(state.get("location"))
    return state