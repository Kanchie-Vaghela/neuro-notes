import express from 'express'

const app = express()
const port = 3000

app.use(express.json()) // ← mandatory, no excuses

const notes = [] // ← in-memory storage


//accept a new note
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

//retrieve all notes
app.get('/notes', (req, res) => {
  res.json(notes)
})

app.post('/transform/chunk', (req, res) => {
  const { content } = req.body;

  if (!content || content.trim() === '') {
    return res.status(400).json({
      error: 'Content is required to generate study chunks'
    });
  }

  const chunks = [
    { task: 'Read the notes once without stopping', duration: '15 min' },
    { task: 'Write down key terms and definitions', duration: '10 min' },
    { task: 'Answer 3 self-check questions', duration: '10 min' },
    { task: 'Take a short break', duration: '5 min' },
    { task: 'Review confusing sections', duration: '15 min' }
  ];

  res.json({
    mode: 'adhd',
    chunks
  });
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
