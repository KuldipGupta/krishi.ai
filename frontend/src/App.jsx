import { useState, useRef, useEffect } from "react"
import { sendMessage } from "./api"

function App() {
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "नमस्ते किसान जी! मैं Krishi.ai हूँ। आप मुझसे फसल, मौसम, मंडी भाव, योजनाओं या crop photo analysis के बारे में पूछ सकते हैं।"
    }
  ])
  const [input, setInput] = useState("")
  const [language, setLanguage] = useState("hi")
  const [loading, setLoading] = useState(false)
  const [image, setImage] = useState(null)
  const [imageBase64, setImageBase64] = useState(null)
  const [imageMimeType, setImageMimeType] = useState(null)
  const bottomRef = useRef(null)
  const fileRef = useRef(null)
  const analysisPrompts = {
    hi: "कृपया इस crop image का विश्लेषण करें।",
    en: "Please analyze this crop image.",
    pa: "ਕਿਰਪਾ ਕਰਕੇ ਇਸ crop image ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰੋ।",
    mr: "कृपया या crop image चे विश्लेषण करा.",
    te: "దయచేసి ఈ crop image ను విశ్లేషించండి."
  }

  // Auto scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Convert image to base64 when farmer selects one
  function handleImageSelect(e) {
    const file = e.target.files[0]
    if (!file) return

    setImage(URL.createObjectURL(file))
    setImageMimeType(file.type || "image/jpeg")

    const reader = new FileReader()
    reader.onload = () => {
      const result = String(reader.result || "")
      const base64 = result.includes(",") ? result.split(",")[1] : result
      setImageBase64(base64)
    }
    reader.readAsDataURL(file)
  }

  // Remove selected image
  function removeImage() {
    setImage(null)
    setImageBase64(null)
    setImageMimeType(null)
    fileRef.current.value = ""
  }

  // Send message to backend
  async function handleSend() {
    if (!input.trim() && !imageBase64) return
    if (loading) return

    const userMessage = input.trim()
    const analysisPrompt = userMessage || analysisPrompts[language] || analysisPrompts.hi

    // Add farmer message to chat
    setMessages(prev => [...prev, {
      role: "user",
      text: userMessage || "📷 Photo sent for analysis",
      image: image
    }])

    setInput("")
    setLoading(true)

    try {
      const data = await sendMessage(analysisPrompt, language, imageBase64, null, imageMimeType)

      // Add AI response to chat
      setMessages(prev => [...prev, {
        role: "ai",
        text: data.reply,
        tool: data.tool_used
      }])

    } catch (error) {
      setMessages(prev => [...prev, {
        role: "ai",
        text: "माफ करें, कुछ गड़बड़ हो गई। कृपया दोबारा कोशिश करें।"
      }])
    }

    setLoading(false)
    setImage(null)
    setImageBase64(null)
    if (fileRef.current) fileRef.current.value = ""
  }

  // Send on Enter key
  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f3fde9_0%,_#eef6e8_40%,_#e3efe0_100%)] flex flex-col items-center justify-center p-4 text-slate-900">

      {/* Chat Container */}
      <div className="w-full max-w-3xl overflow-hidden rounded-[2rem] border border-white/60 bg-white/85 shadow-[0_20px_80px_rgba(22,101,52,0.18)] backdrop-blur flex flex-col h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 text-white bg-gradient-to-r from-emerald-900 via-green-700 to-lime-600">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-emerald-50">
              Krishi.ai
            </div>
            <h1 className="mt-2 text-2xl font-semibold">Smart farming assistant</h1>
            <p className="text-emerald-50/85 text-sm">Crop advice, mandi info, weather, and image analysis in one place</p>
          </div>

          {/* Language Selector */}
          <select
            value={language}
            onChange={e => setLanguage(e.target.value)}
            className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white outline-none backdrop-blur"
          >
            <option value="hi">हिंदी</option>
            <option value="en">English</option>
            <option value="pa">ਪੰਜਾਬੀ</option>
            <option value="mr">मराठी</option>
            <option value="te">తెలుగు</option>
          </select>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4 bg-[linear-gradient(180deg,_rgba(248,252,247,0.7),_rgba(255,255,255,0.98))]">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[82%] px-4 py-3 rounded-3xl text-sm leading-relaxed shadow-sm border ${
                  msg.role === "user"
                    ? "bg-gradient-to-br from-emerald-700 to-green-600 text-white rounded-br-sm border-emerald-500/30"
                    : "bg-white text-slate-800 rounded-bl-sm border-emerald-100"
                }`}
              >
                {/* Show image if sent */}
                {msg.image && (
                  <img
                    src={msg.image}
                    alt="crop"
                    className="rounded-lg mb-2 max-h-40 object-cover"
                  />
                )}
                <p>{msg.text}</p>

                {/* Show which tool was used */}
                {msg.tool && (
                  <p className="text-xs mt-1 opacity-60">
                    🔧 {msg.tool}
                  </p>
                )}
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {loading && (
            <div className="flex justify-start">
              <div className="border border-emerald-100 bg-white px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-lime-500 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Image Preview */}
        {image && (
          <div className="px-4 pb-2 flex items-center gap-3 bg-white/80">
            <img
              src={image}
              alt="preview"
              className="h-16 w-16 object-cover rounded-2xl border border-emerald-200 shadow-sm"
            />
            <button
              onClick={removeImage}
              className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-sm font-medium text-red-600"
            >
              ✕ Remove
            </button>
          </div>
        )}

        {/* Input Bar */}
        <div className="flex items-center gap-2 border-t border-emerald-100 bg-white/95 px-4 py-4">

          {/* Image Upload Button */}
          <button
            onClick={() => fileRef.current.click()}
            className="rounded-full bg-emerald-50 p-3 text-xl text-emerald-700 transition hover:bg-emerald-100"
            title="Upload crop photo"
          >
            📷
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileRef}
            onChange={handleImageSelect}
            className="hidden"
          />

          {/* Text Input */}
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="अपना सवाल यहाँ लिखें या image भेजें..."
            className="flex-1 rounded-full border border-emerald-200 bg-emerald-50/60 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white"
          />

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={loading}
            className="rounded-full bg-gradient-to-r from-emerald-700 to-lime-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Send
          </button>
        </div>

      </div>
    </div>
  )
}

export default App