import express from 'express'

const app = express()
const port = 3000

app.use(express.json()) // ← mandatory, no excuses

const notes = [] // ← in-memory storage

app.post('/notes', (req, res) => {
  const { content } = req.body

  if (!content || content.trim() === '') {
    return res.status(400).json({ error: 'Note content is required' })
  }

  const note = {
    id: Date.now().toString(),
    content,
    createdAt: new Date().toISOString()
  }

  notes.push(note)
  res.status(201).json(note)
})

app.get('/notes', (req, res) => {
  res.json(notes)
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
