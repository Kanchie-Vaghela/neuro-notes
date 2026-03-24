import express from "express"
import { generateContent } from "../controllers/ai.controller.js"
import { protect } from "../middleware/auth.middleware.js"

const router = express.Router()

router.post("/generate", protect, generateContent)

export default router