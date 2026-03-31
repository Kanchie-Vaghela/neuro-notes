import Session from "../models/session.model.js";
import { generateAI, safeParse } from "../services/ai.service.js";

export const generateContent = async (req, res) => {
  try {
    const { mode, content } = req.body;

    if (!mode || !content) {
      return res.status(400).json({
        success: false,
        message: "Mode and content required",
      });
    }

    // CALL AI
    const raw = await generateAI(mode, content);

    let result = safeParse(raw);

    // fallback
    if (!result) {
      result = ["Failed to parse AI response"];
    }

    // always array
    if (!Array.isArray(result)) {
      result = [result];
    }

    // save session
    const session = new Session({
      userId: req.user,
      mode,
      inputNotes: content,
      output: result,
    });

    await session.save();

    res.json({
      success: true,
      mode,
      result,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};