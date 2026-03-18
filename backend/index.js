import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectDB } from './config/db.js'
import authRoutes from "./routes/auth.routes.js"

dotenv.config()

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

connectDB()

app.use("/auth", authRoutes)

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})