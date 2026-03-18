import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectDB } from './config/db.js'
import authRoutes from "./routes/auth.routes.js"
import { protect } from "./middleware/auth.middleware.js"

dotenv.config()

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

connectDB()

app.use("/auth", authRoutes)
app.get("/test", protect, (req, res) => {
  res.json({ userId: req.user })
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})