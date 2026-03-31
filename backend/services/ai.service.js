import axios from "axios";

const MODEL = "qwen/qwen3.6-plus-preview:free";

export const generateAI = async (mode, content) => {
  let prompt = "";

  // 🔥 STRICT PROMPTS (IMPORTANT)

  if (mode === "summary") {
    prompt = `
Return ONLY valid JSON.
Do NOT add explanation.

Format:
["point1", "point2"]

Text:
${content}
`;
  }

  else if (mode === "flashcards") {
    prompt = `
Return ONLY valid JSON.

Generate 5 flashcards.

Format:
[
  { "q": "...", "a": "..." }
]

Text:
${content}
`;
  }

  else if (mode === "quiz") {
    prompt = `
Return ONLY valid JSON.

Generate 5 MCQs.

Format:
[
  {
    "question": "...",
    "options": ["...","...","...","..."],
    "correctIndex": 0
  }
]

Text:
${content}
`;
  }

  else if (mode === "mindmap") {
    prompt = `
Return ONLY valid JSON.

Create a hierarchical mindmap with at least 2 levels of depth.

Format:
[
  {
    "title": "Main Topic",
    "children": [
      {
        "title": "Subtopic",
        "children": [
          { "title": "Detail", "children": [] }
        ]
      }
    ]
  }
]

Text:
${content}
`;
  }

  const response = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: MODEL,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3, // 🔥 lower = more consistent
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.choices[0].message.content;
};

export const safeParse = (text) => {
  try {
    return JSON.parse(text);
  } catch {
    // 🔥 extract JSON if model adds extra text
    const match = text.match(/\[.*\]/s);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {
        return null;
      }
    }
    return null;
  }
};  