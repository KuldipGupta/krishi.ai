export const BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? "http://127.0.0.1:8000/api" : "/api")

export async function sendMessage(
  sessionId,
  message,
  language,
  imageBase64,
  onChunk,   // called for every word that arrives
  onTool,    // called when we know which tool was used
  onDone     // called when streaming is complete
) {
  const response = await fetch(`${BASE_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      session_id: sessionId,
      message: message,
      language: language || "hi",
      image_base64: imageBase64 || null,
      location: { city: "Lucknow" }
    })
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`API error ${response.status}: ${errorText}`)
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ""

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })

    let newlineIndex
    while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
      const line = buffer.slice(0, newlineIndex).trim()
      buffer = buffer.slice(newlineIndex + 1)

      if (!line.startsWith("data: ")) continue

      try {
        const data = JSON.parse(line.slice(6))
        if (data.type === "tool") onTool(data.tool)
        if (data.type === "chunk") onChunk(data.content)
        if (data.type === "done") onDone()
      } catch (e) {
        // Ignore malformed or incomplete JSON on this line
      }
    }
  }

  if (buffer.trim().startsWith("data: ")) {
    try {
      const data = JSON.parse(buffer.trim().slice(6))
      if (data.type === "tool") onTool(data.tool)
      if (data.type === "chunk") onChunk(data.content)
      if (data.type === "done") onDone()
    } catch (e) {
      // Ignore leftover partial buffer
    }
  }
}