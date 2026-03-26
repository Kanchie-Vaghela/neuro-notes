import { useState } from "react"
import { apiRequest } from "../utils/api"

export default function Home({ token }) {
  const [notes, setNotes] = useState("")
  const [mode, setMode] = useState("summary")
  const [result, setResult] = useState(null)

  const generate = async () => {
    const data = await apiRequest(
      "/ai/generate",
      "POST",
      { mode, content: notes },
      token
    )

    setResult(data.result)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl mb-4">Neuro Study</h1>

      <textarea
        className="w-full p-3 rounded bg-gray-800 mb-4"
        rows="5"
        placeholder="Paste your notes..."
        onChange={e => setNotes(e.target.value)}
      />

      <div className="flex gap-2 mb-4">
        {["summary", "flashcards", "mindmap", "quiz"].map(m => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-3 py-1 rounded ${
              mode === m ? "bg-blue-500" : "bg-gray-700"
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      <button
        onClick={generate}
        className="bg-purple-500 px-4 py-2 rounded mb-6"
      >
        Generate
      </button>

      {result && (
        <div className="bg-gray-800 p-4 rounded">
          <pre className="whitespace-pre-wrap">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}