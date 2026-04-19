import { useState, useEffect } from "react";
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
    if (!notes.trim()) return;

    const userInput = notes;

    // Add user message immediately
    setMessages((prev) => [...prev, { role: "user", content: userInput }]);

    try {
      setLoading(true);

      const data = await apiRequest(
        "/ai/generate",
        "POST",
        { mode, content: userInput },
        token,
      );

      // Add AI response
      setMessages((prev) => [...prev, { role: "ai", content: data.result }]);

      setResult(data.result);
      setNotes(""); // clear input after success

      fetchSessions(); // refresh history
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

  useEffect(() => {
    if (token) fetchSessions();
  }, [token]);

  const uniqueSessions = groupedSessions();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex">
      {/* LEFT: History */}
      <div className="w-1/3 p-4">
        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-4 h-full shadow-sm border border-gray-200 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">History</h2>

          {uniqueSessions.length === 0 && (
            <p className="text-sm text-gray-400">No history yet</p>
          )}

          <div className="space-y-2">
            {uniqueSessions.map((s) => (
              <div
                key={s._id}
                onClick={() => {
                  setMode(s.mode);
                  setResult(s.output);
                  setMessages([]);
                }}
                className="p-3 rounded-xl cursor-pointer hover:bg-gray-100 transition"
              >
                <p className="text-xs text-indigo-500 uppercase font-semibold">{s.mode}</p>
                <p className="text-sm text-gray-600">{truncateText(s.inputNotes)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT: Main */}
      <div className="w-2/3 p-6 flex flex-col">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 flex justify-between items-center">
          Neuro Study ✨
          <button
            onClick={logout}
            className="bg-red-400 px-3 py-0.5 rounded text-white text-sm hover:bg-red-500 transition"
          >
            Logout
          </button>
        </h1>

        {/* Output - Chat Interface */}
        <div className="flex-1 bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-gray-200 overflow-y-auto mb-4 flex flex-col gap-4">
          {messages.length === 0 && !result && (
            <p className="text-gray-400 text-center mt-10">
              Your AI-generated content will appear here...
            </p>
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
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                  msg.role === "user"
                    ? "bg-indigo-500 text-white rounded-br-none"
                    : "bg-gray-200 text-gray-800 rounded-bl-none"
                }`}
              >
                {msg.role === "ai" ? (
                  <>
                    {mode === "summary" && typeof msg.content === "object" && (
                      <SummaryView data={msg.content} />
                    )}
                    {mode === "flashcards" && typeof msg.content === "object" && (
                      <FlashcardView data={msg.content} />
                    )}
                    {mode === "quiz" && typeof msg.content === "object" && (
                      <QuizView data={msg.content} />
                    )}
                    {mode === "mindmap" && typeof msg.content === "object" && (
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
              <div className="bg-gray-200 text-gray-800 px-4 py-3 rounded-2xl rounded-bl-none">
                <p className="text-sm">Generating...</p>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-3 flex items-center gap-3 shadow-sm border border-gray-200">
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="bg-gray-100 px-3 py-2 rounded-lg text-sm outline-none"
          >
            <option value="summary">Summary</option>
            <option value="flashcards">Flashcards</option>
            <option value="mindmap">Mindmap</option>
            <option value="quiz">Quiz</option>
          </select>

          <textarea
            className="flex-1 bg-transparent outline-none resize-none text-gray-700"
            rows="2"
            placeholder="Paste notes or ask something..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <button
            onClick={generate}
            disabled={loading}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-xl transition disabled:opacity-50"
          >
            {loading ? "..." : "Generate"}
          </button>
        </div>
      </div>
    </div>
  );
}
