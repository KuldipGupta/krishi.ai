import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom"
import ChatPage from "./pages/ChatPage"
import KhataPage from "./pages/KhataPage"

// Navigation bar shown on all pages
function NavBar() {
  const location = useLocation()

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 border-b border-slate-200 px-4 py-2 flex items-center justify-between max-w-2xl mx-auto shadow-sm shadow-slate-200/80 backdrop-blur-sm">
      <span className="text-blue-700 font-bold text-lg">🌾 krishi.ai</span>
      <div className="flex items-center gap-2">
        <Link
          to="/"
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
            location.pathname === "/"
              ? "bg-blue-600 text-white"
              : "text-blue-700 hover:bg-blue-50"
          }`}
        >
          💬 Chat
        </Link>
        <Link
          to="/khata"
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
            location.pathname === "/khata"
              ? "bg-blue-600 text-white"
              : "text-blue-700 hover:bg-blue-50"
          }`}
        >
          📒 खाता
        </Link>
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300">
        <NavBar />
        <div className="pt-14 bg-slate-50">
          <Routes>
            <Route path="/"       element={<ChatPage />} />
            <Route path="/khata"  element={<KhataPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
