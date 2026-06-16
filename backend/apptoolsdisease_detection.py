# disease_detection.py — stub for now, real implementation Day 3
from app.agent.state import AgentState

def disease_detection_tool(state: AgentState) -> AgentState:
    state["tool_result"] = "Disease detection tool coming soon. Image received: " + str(bool(state.get("image_base64")))
    return state