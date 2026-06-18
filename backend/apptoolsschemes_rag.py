# schemes_rag.py
# Government schemes tool
# Searches through scheme documents and returns relevant information

from app.agent.state import AgentState
from appservicesembeddings import get_relevant_schemes

def schemes_rag_tool(state: AgentState) -> AgentState:
    query = state["message"]
    
    relevant_content = get_relevant_schemes(query)
    
    state["tool_result"] = relevant_content
    return state