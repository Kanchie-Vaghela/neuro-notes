import mongoose from "mongoose"

const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  mode: {
    type: String,
    required: true
  },
  inputNotes: {
    type: String,
    required: true
  },
  output: {
    type: mongoose.Schema.Types.Mixed
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.model("Session", sessionSchema)