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

  //  Generate
  const generate = async () => {
    if (!notes.trim()) return;

    try {
      setLoading(true);

      const data = await apiRequest(
        "/ai/generate",
        "POST",
        { mode, content: notes },
        token,
      );

      setResult(data.result);

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
      setSessions(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (token) fetchSessions();
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex">
      {/* LEFT: History */}
      <div className="w-1/3 p-4">
        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-4 h-full shadow-sm border border-gray-200 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">History</h2>

          {sessions.length === 0 && (
            <p className="text-sm text-gray-400">No history yet</p>
          )}

          <div className="space-y-2">
            {sessions.map((s) => (
              <div
                key={s._id}
                onClick={() => {
                  setMode(s.mode);
                  setResult(s.output); // ✅ important fix
                }}
                className="p-3 rounded-xl cursor-pointer hover:bg-gray-100 transition"
              >
                <p className="text-xs text-indigo-500 uppercase">{s.mode}</p>
                <p className="text-sm text-gray-600 truncate">{s.inputNotes}</p>
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

        {/* Output */}
        <div className="flex-1 bg-white/70 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-gray-200 overflow-y-auto mb-4">
          {!result && (
            <p className="text-gray-400 text-center mt-10">
              Your AI-generated content will appear here...
            </p>
          )}

          {result && (
            <>
              {mode === "summary" && <SummaryView data={result} />}
              {mode === "flashcards" && <FlashcardView data={result} />}
              {mode === "quiz" && <QuizView data={result} />}
              {mode === "mindmap" && <MindmapView data={result} />}
            </>
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
