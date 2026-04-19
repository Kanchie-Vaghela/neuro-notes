import Session from "../models/session.model.js";
import { generateAI, safeParse } from "../services/ai.service.js";

export const generateContent = async (req, res) => {
  const { mode, content } = req.body;

  console.log("[AI CONTROLLER] request received", { mode, contentLength: content?.length });

  if (!mode || !content) {
    return res.status(400).json({
      success: false,
      message: "Mode and content are required",
    });
  }

  try {
    console.log("[AI CONTROLLER] calling generateAI", { mode });
    const raw = await generateAI(mode, content);
    console.log("[AI CONTROLLER] raw AI response", { raw });

    let result = safeParse(raw);

    if (result === null || result === undefined) {
      result = raw;
    }

    const session = new Session({
      userId: req.user,
      mode,
      inputNotes: content,
      output: result,
    });

    await session.save();

    return res.json({
      success: true,
      mode,
      result,
    });
  } catch (error) {
    const errorMessage =
      error?.response?.data || error?.message || "Unknown AI error";

    console.error("[AI CONTROLLER] error", errorMessage);

    return res.status(500).json({
      success: false,
      message: typeof errorMessage === "string" ? errorMessage : JSON.stringify(errorMessage),
    });
  }
};