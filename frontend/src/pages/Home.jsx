import { useState, useEffect, useRef } from "react";
import { apiRequest } from "../utils/api";
import FlashcardView from "../components/modes/FlashcardView";
import SummaryView from "../components/modes/SummaryView";
import MindmapView from "../components/modes/MindmapView";
import QuizView from "../components/modes/QuizView";

export default function Home({ token, logout }) {
  const [notes, setNotes] = useState("");
  const [mode, setMode] = useState("summary");
  const [result, setResult] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [lastUserInput, setLastUserInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const textareaRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Auto-resize textarea
  const autoResizeTextarea = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    const newHeight = Math.min(textarea.scrollHeight, 145); // ~5 lines at default font size
    textarea.style.height = `${newHeight}px`;
  };

  // Handle keydown for Enter to submit, Shift+Enter for new line
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      generate();
    }
  };

  // Group sessions by unique inputNotes (deduplicate)
  const groupedSessions = () => {
    const map = new Map();
    sessions.forEach((session) => {
      const key = session.inputNotes;
      if (!map.has(key) || new Date(session.createdAt) > new Date(map.get(key).createdAt)) {
        map.set(key, session);
      }
    });
    return Array.from(map.values()).sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  };

  // Truncate text to ~50 chars
  const truncateText = (text, maxLength = 50) => {
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  //  Generate
  const generate = async () => {
    // 1. Determine input
    const finalInput = notes.trim() || lastUserInput;

    if (!finalInput) return; // Prevent empty API calls

    const userTypedNew = notes.trim().length > 0;
    const generationMode = mode; // capture mode at generation time

    // 2. Add user message ONLY if user typed something new
    if (userTypedNew) {
      setMessages((prev) => [...prev, { role: "user", content: finalInput }]);
      setLastUserInput(finalInput); // Update lastUserInput
    }

    try {
      setLoading(true);

      // 3. Call API using finalInput
      const data = await apiRequest(
        "/ai/generate",
        "POST",
        { mode: generationMode, content: finalInput },
        token,
      );

      // SESSION CONSISTENCY: Set session ID ONLY on first generation in this chat
      // Subsequent mode changes reuse the same session (no new session created)
      // This ensures one chat session persists across all mode variations
      if (!currentSessionId) {
        setCurrentSessionId(data._id);
      }

      // 4. Append AI response (always append, never overwrite)
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: data.result, mode: generationMode },
      ]);

      setResult(data.result);

      // 5. Clear input ONLY if user typed new input
      if (userTypedNew) {
        setNotes("");
      }

      // Don't fetch all sessions here - only refresh when user navigates
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  //  Fetch history
  const fetchSessions = async () => {
    try {
      const data = await apiRequest("/sessions", "GET", null, token);
      if (Array.isArray(data)) {
        setSessions(data);
      } else {
        console.error("Unexpected sessions response:", data);
        setSessions([]);
      }
    } catch (err) {
      console.error(err);
      if (err.status === 401) {
        logout();
      }
      setSessions([]);
    }
  };

  // Start a new chat (clears session context)
  const startNewChat = () => {
    setMessages([]);
    setCurrentSessionId(null); // Reset session ID so next generate creates fresh session
    setResult(null);
    setNotes("");
    setLastUserInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "52px";
    }
  };

  // Load a session from history (establishes session context for future generations)
  const loadSession = (session) => {
    setMode(session.mode);
    setResult(session.output);
    setCurrentSessionId(session._id); // Set session ID from history
    setLastUserInput(session.inputNotes); // Preserve input context for mode changes
    // Reconstruct messages from this session with mode tracking
    setMessages([
      { role: "user", content: session.inputNotes },
      { role: "ai", content: session.output, mode: session.mode },
    ]);
  };

  useEffect(() => {
    if (token) fetchSessions();
  }, [token]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      setTimeout(() => {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }, 0);
    }
  }, [messages, loading]);

  const uniqueSessions = groupedSessions();

  return (
    <div className="h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 flex flex-col overflow-hidden">
      {/* HEADER */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm shrink-0">
        <div className="flex justify-between items-center px-6 py-4">
          {/* LEFT: Hamburger + App Name */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-700 hover:bg-gray-100 p-2 rounded-lg transition"
              title="Toggle sidebar"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Study AI</h1>
          </div>

          {/* RIGHT: Actions */}
          <div className="flex items-center gap-3">
            {currentSessionId && (
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-lg">
                Session Active
              </span>
            )}
            
            <button
              onClick={logout}
              className="bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-sm transition font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
        <div
          className={`transition-all duration-300 shrink-0 ${
            sidebarOpen ? "w-68" : "w-0"
          } overflow-hidden`}
        >
          {sidebarOpen && (
            <div className="bg-white/70 backdrop-blur-md  h-full shadow-sm border-r border-gray-200 overflow-hidden flex flex-col">
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100 px-4 py-3">
                <h2 className="text-lg font-semibold text-gray-800">Chat History</h2>
                <button
                  onClick={() => fetchSessions()}
                  className="text-gray-400 hover:text-indigo-500 transition-colors duration-200 p-1 rounded hover:bg-gray-50"
                  title="Refresh history"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>

              {uniqueSessions.length === 0 && (
                <div className="flex-1 flex items-center justify-center px-4">
                  <p className="text-sm text-gray-400 text-center">
                    No chat history yet<br />
                    <span className="text-xs">Start a conversation to see sessions here</span>
                  </p>
                </div>
              )}

              <div className="space-y-3 flex-1 overflow-y-auto mb-3 scroll-smooth">
                {uniqueSessions.map((s) => (
                  <div
                    key={s._id}
                    onClick={() => loadSession(s)}
                    className={`p-3 rounded-xl cursor-pointer transition-all duration-200 hover:bg-gray-50 hover:shadow-sm hover:scale-[1.02] ${
                      currentSessionId === s._id
                        ? "bg-indigo-50 border-l-4 border-indigo-500 shadow-sm"
                        : "hover:border-l-2 hover:border-gray-300"
                    }`}
                  >
                    <p className={`text-xs uppercase font-semibold mb-2 ${
                      currentSessionId === s._id ? "text-indigo-600" : "text-indigo-500"
                    }`}>
                      {s.mode}
                    </p>
                    <p className="text-sm text-gray-700 leading-relaxed line-clamp-2 overflow-hidden">
                      {s.inputNotes}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-3 pb-2 mt-3 px-4">
                <button
                  onClick={startNewChat}
                  className="w-full bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-sm py-3 rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md transform hover:scale-[1.02]"
                >
                  + New Chat
                </button>
              </div>
            </div>
          )}
        </div>

        {/* CHAT AREA */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* MESSAGES CONTAINER */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto scroll-smooth p-6 flex flex-col gap-4"
          >
            {messages.length === 0 && !result && (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-400 text-center text-lg">
                  Your AI-generated content will appear here...
                </p>
              </div>
            )}

            {/* Display previous result (from history) */}
            {!loading && messages.length === 0 && result && (
              <>
                {mode === "summary" && <SummaryView data={result} />}
                {mode === "flashcards" && <FlashcardView data={result} />}
                {mode === "quiz" && <QuizView data={result} />}
                {mode === "mindmap" && <MindmapView data={result} />}
              </>
            )}

            {/* Chat Messages */}
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[60%] px-4 py-3 rounded-2xl shadow-sm ${
                    msg.role === "user"
                      ? "bg-linear-to-r from-indigo-500 to-purple-600 text-white rounded-br-md"
                      : "bg-white text-gray-800 rounded-bl-md border border-gray-100"
                  }`}
                >
                {msg.role === "ai" ? (
                  <>
                    {msg.mode === "summary" && typeof msg.content === "object" && (
                      <SummaryView data={msg.content} />
                    )}
                    {msg.mode === "flashcards" && typeof msg.content === "object" && (
                      <FlashcardView data={msg.content} />
                    )}
                    {msg.mode === "quiz" && typeof msg.content === "object" && (
                      <QuizView data={msg.content} />
                    )}
                    {msg.mode === "mindmap" && typeof msg.content === "object" && (
                      <MindmapView data={msg.content} />
                    )}
                    {typeof msg.content === "string" && (
                      <p className="text-sm">{msg.content}</p>
                    )}
                  </>
                ) : (
                  <p className="text-sm">{msg.content}</p>
                )}
              </div>
            </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="max-w-[60%] bg-white text-gray-800 px-4 py-3 rounded-2xl rounded-bl-md border border-gray-100 shadow-sm">
                  <p className="text-sm">Generating...</p>
                </div>
              </div>
            )}
          </div>

          {/* INPUT SECTION */}
          <div className="shrink-0 p-4 border-t border-gray-200 bg-white/80 backdrop-blur-md">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-end gap-4">
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value)}
                  className="bg-gray-100 px-4 py-3 rounded-lg text-sm outline-none border border-gray-200 min-w-35"
                >
                  <option value="summary">Summary</option>
                  <option value="flashcards">Flashcards</option>
                  <option value="mindmap">Mindmap</option>
                  <option value="quiz">Quiz</option>
                </select>

                <div className="flex-1 relative">
                  <textarea
                    ref={textareaRef}
                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-gray-700 outline-none resize-none overflow-y-auto focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    placeholder="Paste notes or ask something... (Enter to submit, Shift+Enter for new line)"
                    value={notes}
                    onChange={(e) => {
                      setNotes(e.target.value);
                      autoResizeTextarea();
                    }}
                    onKeyDown={handleKeyDown}
                    style={{ minHeight: "52px", maxHeight: "120px" }}
                    rows={1}
                  />
                </div>

                <button
                  onClick={generate}
                  disabled={loading}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed font-medium whitespace-nowrap"
                >
                  {loading ? "..." : "Generate"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
