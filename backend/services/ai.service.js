import axios from "axios";

const MODEL = "openai/gpt-4o-mini";
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

const buildPrompt = (mode, content) => {
  switch (mode) {
    case "summary":
      return `Return ONLY valid JSON. Do NOT add explanation.\n\nFormat:\n[\"point1\", \"point2\"]\n\nText:\n${content}`;
    case "flashcards":
      return `Return ONLY valid JSON. Do NOT add explanation.\n\nGenerate 5 flashcards.\n\nFormat:\n[\n  { \"q\": \"...\", \"a\": \"...\" }\n]\n\nText:\n${content}`;
    case "quiz":
      return `Return ONLY valid JSON. Do NOT add explanation.\n\nGenerate 5 MCQs.\n\nFormat:\n[\n  {\n    \"question\": \"...\",\n    \"options\": [\"...\",\"...\",\"...\",\"...\"],\n    \"correctIndex\": 0\n  }\n]\n\nText:\n${content}`;
    case "mindmap":
      return `Return ONLY valid JSON. Do NOT add explanation.\n\nCreate a hierarchical mindmap with at least 2 levels of depth.\n\nFormat:\n[\n  {\n    \"title\": \"Main Topic\",\n    \"children\": [\n      {\n        \"title\": \"Subtopic\",\n        \"children\": [\n          { \"title\": \"Detail\", \"children\": [] }\n        ]\n      }\n    ]\n  }\n]\n\nText:\n${content}`;
    default:
      return `Return ONLY valid JSON. Do NOT add explanation.\n\nText:\n${content}`;
  }
};

export const generateAI = async (mode, content) => {
  const prompt = buildPrompt(mode, content);

  console.log("[AI SERVICE] calling OpenRouter", { mode, promptLength: prompt.length });

  const response = await axios.post(
    OPENROUTER_URL,
    {
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      timeout: 30000,
    }
  );

  const rawText = response.data?.choices?.[0]?.message?.content;

  if (!rawText || typeof rawText !== "string") {
    throw new Error("Empty AI response");
  }

  return rawText;
};

export const safeParse = (text) => {
  if (typeof text !== "string") return null;

  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/(\{.*\}|\[.*\])/s);
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