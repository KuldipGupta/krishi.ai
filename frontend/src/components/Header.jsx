function Header({ language, onLanguageChange }) {
  return (
    <div className="bg-gradient-to-r from-blue-700 via-sky-600 to-blue-600 text-white px-6 py-4 rounded-t-2xl flex items-center justify-between shadow-lg shadow-slate-200/50 dark:from-slate-800 dark:via-slate-900 dark:to-slate-950 dark:shadow-none">
      <div>
        <h1 className="text-xl font-bold tracking-tight">🌾 krishi.ai</h1>
        <p className="text-blue-100 text-sm dark:text-slate-300">किसान के सवालों का तेज़ और भरोसेमंद जवाब</p>
      </div>

      <select
        value={language}
        onChange={(e) => onLanguageChange(e.target.value)}
        className="bg-blue-800 text-white text-sm rounded-lg px-3 py-1 border border-blue-500 outline-none focus:ring-2 focus:ring-blue-300"
      >
        <option value="hi">हिंदी</option>
        <option value="en">English</option>
        <option value="pa">ਪੰਜਾਬੀ</option>
        <option value="mr">मराठी</option>
        <option value="te">తెలుగు</option>
      </select>
    </div>
  )
}

export default Header