import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import authDb from '../authDb.js'
import { requireAuth } from '../middleware/auth.js'
import { createUserDb } from '../userDb.js'
import { signToken } from '../utils/jwt.js'

const router = Router()

interface UserRow {
  id: string
  username: string
  password_hash: string
  created_at: string
}

const USERNAME_PATTERN = /^[a-zA-Z0-9_]{3,32}$/
const MIN_PASSWORD_LENGTH = 6

function validateCredentials(username: string, password: string): string | null {
  if (!USERNAME_PATTERN.test(username)) {
    return 'Имя пользователя: 3–32 символа, только буквы, цифры и _'
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Пароль должен быть не короче ${MIN_PASSWORD_LENGTH} символов`
  }

  return null
}

router.post('/register', (req, res) => {
  const { username, password } = req.body as {
    username?: string
    password?: string
  }

  if (!username?.trim() || !password) {
    res.status(400).json({ error: 'Укажите имя пользователя и пароль' })
    return
  }

  const normalizedUsername = username.trim()
  const validationError = validateCredentials(normalizedUsername, password)

  if (validationError) {
    res.status(400).json({ error: validationError })
    return
  }

  const existing = authDb
    .prepare('SELECT id FROM users WHERE username = ? COLLATE NOCASE')
    .get(normalizedUsername)

  if (existing) {
    res.status(409).json({ error: 'Пользователь с таким именем уже существует' })
    return
  }

  const id = uuidv4()
  const passwordHash = bcrypt.hashSync(password, 10)
  const createdAt = new Date().toISOString()

  authDb
    .prepare(
      'INSERT INTO users (id, username, password_hash, created_at) VALUES (?, ?, ?, ?)',
    )
    .run(id, normalizedUsername, passwordHash, createdAt)

  createUserDb(id)

  const token = signToken({ userId: id, username: normalizedUsername })

  res.status(201).json({
    token,
    user: { id, username: normalizedUsername },
  })
})

router.post('/login', (req, res) => {
  const { username, password } = req.body as {
    username?: string
    password?: string
  }

  if (!username?.trim() || !password) {
    res.status(400).json({ error: 'Укажите имя пользователя и пароль' })
    return
  }

  const row = authDb
    .prepare('SELECT * FROM users WHERE username = ? COLLATE NOCASE')
    .get(username.trim()) as UserRow | undefined

  if (!row || !bcrypt.compareSync(password, row.password_hash)) {
    res.status(401).json({ error: 'Неверное имя пользователя или пароль' })
    return
  }

  const token = signToken({ userId: row.id, username: row.username })

  res.json({
    token,
    user: { id: row.id, username: row.username },
  })
})

router.get('/me', requireAuth, (req, res) => {
  res.json({ id: req.user!.id, username: req.user!.username })
})

export default router
