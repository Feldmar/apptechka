import cors from 'cors'
import express from 'express'
import intakesRouter from './routes/intakes.js'
import medicationsRouter from './routes/medications.js'

const app = express()
const PORT = Number(process.env.PORT) || 3001

app.use(cors())
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

app.use('/api/medications', medicationsRouter)
app.use('/api/intakes', intakesRouter)

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`)
})
