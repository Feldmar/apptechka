import type { NextFunction, Request, Response } from 'express'
import { verifyToken } from '../utils/jwt.js'

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization

  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Требуется авторизация' })
    return
  }

  const token = header.slice('Bearer '.length)

  try {
    const payload = verifyToken(token)
    req.user = {
      id: payload.userId,
      username: payload.username,
    }
    next()
  } catch {
    res.status(401).json({ error: 'Недействительный или просроченный токен' })
  }
}
