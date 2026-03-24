import Session from "../models/session.model.js"

export const generateContent = async (req, res) => {
  try {
    const { mode, content } = req.body

    if (!mode || !content) {
      return res.status(400).json({ message: "Mode and content required" })
    }

    let result

    // MOCK AI OUTPUT FOR NOW
    if (mode === "summary") {
      result = `Summary: ${content.slice(0,100)}...`
    }

    if (mode === "flashcards") {
      result = [
        { question: "Main topic?", answer: content.slice(0,50) }
      ]
    }

    if (mode === "mindmap") {
      result = {
        title: "Root",
        children: [
          { title: "Key Idea 1" },
          { title: "Key Idea 2" }
        ]
      }
    }

    if (mode === "quiz") {
      result = [
        {
          question: "Example question?",
          options: ["A", "B", "C", "D"],
          answer: "A"
        }
      ]
    }

    const session = new Session({
      userId: req.user,
      mode,
      inputNotes: content,
      output: result
    })

    await session.save()

    res.json({
      mode,
      result
    })

  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}