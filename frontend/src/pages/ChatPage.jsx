import { useState } from "react"
import { sendMessage } from "../api"
import Header from "../components/Header"
import MessageList from "../components/MessageList"
import ImagePreview from "../components/ImagePreview"
import InputBar from "../components/InputBar"

function ChatPage() {
  const [sessionId] = useState(() => {
    const existing = localStorage.getItem("kisaan_session_id")
    if (existing) return existing
    const newId = "farmer_" + Math.random().toString(36).substr(2, 9)
    localStorage.setItem("kisaan_session_id", newId)
    return newId
  })

  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "नमस्ते किसान जी! मैं krishi.ai हूँ। आप मुझसे फसल, मौसम, मंडी भाव या सरकारी योजनाओं के बारे में पूछ सकते हैं।"
    }
  ])
  const [input, setInput]       = useState("")
  const [language, setLanguage] = useState("hi")
  const [loading, setLoading]   = useState(false)
  const [image, setImage]       = useState(null)
  const [imageBase64, setImageBase64] = useState(null)

  function handleImageSelect(file) {
    setImage(URL.createObjectURL(file))
    const reader = new FileReader()
    reader.onload = () => {
      const base64 = reader.result.split(",")[1]
      setImageBase64(base64)
    }
    reader.readAsDataURL(file)
  }

  function handleRemoveImage() {
    setImage(null)
    setImageBase64(null)
  }

  async function handleSend() {
    if (!input.trim() && !imageBase64) return
    if (loading) return

    const userMessage = input.trim()

    setMessages(prev => [...prev, {
      role: "user",
      text: userMessage || "📷 Photo sent for analysis",
      image: image
    }])

    setInput("")
    setLoading(true)

    setMessages(prev => [...prev, { role: "ai", text: "", tool: "" }])

    try {
      await sendMessage(
        sessionId, userMessage, language, imageBase64,
        (chunk) => {
          setMessages(prev => {
            const updated = [...prev]
            const last = updated[updated.length - 1]
            updated[updated.length - 1] = { ...last, text: last.text + chunk }
            return updated
          })
        },
        (tool) => {
          setMessages(prev => {
            const updated = [...prev]
            updated[updated.length - 1] = { ...updated[updated.length - 1], tool }
            return updated
          })
        },
        () => { setLoading(false) }
      )
    } catch (error) {
      setMessages(prev => {
        const updated = [...prev]
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          text: "माफ करें, कुछ गड़बड़ हो गई। कृपया दोबारा कोशिश करें।"
        }
        return updated
      })
      setLoading(false)
    }

    setImage(null)
    setImageBase64(null)
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 dark:bg-slate-950">
      <div className="w-full max-w-2xl bg-white/95 rounded-3xl shadow-[0_20px_50px_rgba(15,23,42,0.12)] border border-slate-200 overflow-hidden flex flex-col h-[86vh] dark:bg-slate-900 dark:border-slate-800">
        <Header language={language} onLanguageChange={setLanguage} />
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 dark:bg-slate-950 dark:border-slate-800">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            पूछें: मौसम, फसल रोग, मंडी भाव या सरकारी योजनाओं के बारे में — krishi.ai तुरंत मदद करेगा।
          </p>
        </div>
        <MessageList messages={messages} loading={loading} />
        <ImagePreview image={image} onRemove={handleRemoveImage} />
        <InputBar
          input={input}
          onInputChange={setInput}
          onSend={handleSend}
          onImageSelect={handleImageSelect}
          loading={loading}
        />
      </div>
    </div>
  )
}

export default ChatPage