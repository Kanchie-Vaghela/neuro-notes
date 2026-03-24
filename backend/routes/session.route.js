import express from "express"
import {
  getSessions,
  getSessionById,
  deleteSession
} from "../controllers/session.controller.js"
import { protect } from "../middleware/auth.middleware.js"

const router = express.Router()

router.get("/", protect, getSessions)
router.get("/:id", protect, getSessionById)
router.delete("/:id", protect, deleteSession)

export default router