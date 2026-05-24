#  AI Study Companion

An AI-powered full-stack study assistant that transforms raw notes into structured learning materials — summaries, flashcards, quizzes, and mindmaps — so you spend less time prepping and more time actually learning.



##  Features

- **Smart Summarization** — Paste raw notes and get concise, structured summaries instantly
- **Flashcard Generator** — Auto-generates question/answer flashcard decks with interactive flip animations
- **Quiz Mode** — Dynamic quizzes with real-time feedback and score tracking
- **Mindmap Visualization** — Graph-based visual representation of key concepts and their relationships
- **Session History** — Personalized learning history saved per user across sessions
- **JWT Authentication** — Secure login, protected routes, and persistent sessions


## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Tailwind CSS |
| Backend | Node.js, Express |
| Database | MongoDB |
| AI | OpenRouter API (prompt-engineered pipelines) |
| Auth | JWT (JSON Web Tokens) |


## 🤖 AI Pipeline

Notes are sent to the backend where a structured prompt is constructed based on the selected learning mode. The OpenRouter API returns consistent **JSON responses** for each mode:

| Mode | Output Format |
|---|---|
| Summary | `{ title, summary, keyPoints[] }` |
| Flashcards | `{ cards: [{ question, answer }] }` |
| Quiz | `{ questions: [{ question, options[], correct }] }` |
| Mindmap | `{ nodes: [], edges: [] }` |

Prompt engineering ensures the model always returns valid, parseable JSON regardless of input length or complexity.


## 🔐 Authentication Flow

1. User registers → password hashed → stored in MongoDB
2. User logs in → JWT issued (expiry configurable)
3. Token stored client-side → sent via `Authorization: Bearer` header
4. Protected routes validate token via Express middleware
5. All study sessions are linked to the authenticated user

