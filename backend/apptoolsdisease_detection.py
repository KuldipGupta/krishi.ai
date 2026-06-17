from app.agent.state import AgentState
from app.config import GEMINI_API_KEY
from google import genai
from google.genai import types
import base64

client = genai.Client(api_key=GEMINI_API_KEY)

DISEASE_PROMPT = """You are an expert agricultural scientist specializing in crop diseases.

Analyze this crop image carefully and provide:
1. What disease or pest problem you can see
2. How severe it is (mild/moderate/severe)
3. What caused it
4. Treatment steps in simple language

If the image is not a crop or plant, say "Please send a clear photo of your crop."
Be specific and practical. A farmer will read this."""

def disease_node(state: AgentState) -> AgentState:
    image_base64 = state.get("image_base64")
    mime_type = state.get("image_mime_type") or "image/jpeg"

    if not image_base64:
        state["tool_result"] = "No image received. Please send a photo of your crop for disease analysis."
        return state

    try:
        image_data = base64.b64decode(image_base64)

        response = client.models.generate_content(
            model="gemini-1.5-flash",
            contents=[
                DISEASE_PROMPT,
                types.Part.from_bytes(
                    data=image_data,
                    mime_type=mime_type
                )
            ]
        )

        state["tool_result"] = response.text

    except Exception as e:
        state["tool_result"] = "Could not analyze image. Please try again with a clearer photo."

    return state