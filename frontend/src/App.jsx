import { useState } from "react";

function App() {
  const [notes, setNotes] = useState("");
  const [chunks, setChunks] = useState([]);
  const [loading, setLoading] = useState(false);

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
