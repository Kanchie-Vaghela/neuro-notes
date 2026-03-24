import Session from "../models/session.model.js"

export const getSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ userId: req.user })
      .sort({ createdAt: -1 })

    res.json(sessions)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}

export const getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)

    if (!session || session.userId.toString() !== req.user) {
      return res.status(404).json({ message: "Session not found" })
    }

    res.json(session)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}

export const deleteSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)

    if (!session || session.userId.toString() !== req.user) {
      return res.status(404).json({ message: "Session not found" })
    }

    await session.deleteOne()

    res.json({ message: "Session deleted" })
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}