import { useState } from "react";

function App() {
  const [notes, setNotes] = useState("");
  const [chunks, setChunks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [readText, setReadText] = useState("");
  const [summary, setSummary] = useState("");
  const [cards, setCards] = useState([]);

  const generatePlan = async () => {
    if (!notes.trim()) return;

    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/transform/chunk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: notes }),
      });

      const data = await res.json();
      setChunks(data.chunks || []);
    } catch (err) {
      console.error(err);
      alert("Backend not reachable");
    }

    setLoading(false);
  };

  const readMode = async () => {
    if (!notes.trim()) return;

    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/transform/read", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: notes }),
      });

      const data = await res.json();
      setReadText(data.text || "");
      setChunks([]);
    } catch (err) {
      console.error(err);
      alert("Backend not reachable");
    }

    setLoading(false);
  };

  const summarize = async () => {
    if (!notes.trim()) return;

    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/transform/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: notes }),
      });

      const data = await res.json();
      setSummary(data.text || "");
      setChunks([]);
      setReadText("");
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  const generateFlashcards = async () => {
    if (!notes.trim()) return;

    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/transform/flashcards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: notes }),
      });

      const data = await res.json();
      setCards(data.cards || []);
      setChunks([]);
      setReadText("");
      setSummary("");
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Neuro Notes</h1>

      <textarea
        rows={8}
        style={{ width: "100%", marginBottom: 10 }}
        placeholder="Paste your study notes here..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      <button onClick={generatePlan}>
        {loading ? "Generating..." : "Generate Study Plan"}
      </button>
      <button onClick={readMode} style={{ marginLeft: 10 }}>
        Read Mode
      </button>
      <button onClick={summarize} style={{ marginLeft: 10 }}>
        Summarize
      </button>
      <button onClick={generateFlashcards} style={{ marginLeft: 10 }}>
        Flashcards
      </button>
      {cards.length > 0 && (
        <div style={{ marginTop: 30 }}>
          {cards.map((c, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <strong>Q:</strong> {c.question}
              <br />
              <strong>A:</strong> {c.answer}
            </div>
          ))}
        </div>
      )}

      {readText && (
        <div style={{ marginTop: 30, whiteSpace: "pre-wrap" }}>{readText}</div>
      )}

      {summary && (
        <div style={{ marginTop: 30, whiteSpace: "pre-wrap" }}>{summary}</div>
      )}

      <div style={{ marginTop: 30 }}>
        {chunks.map((c, i) => (
          <div key={i}>
            ☐ {c.task} ({c.duration})
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
