import type { Request, Response, NextFunction } from 'express'
import { verifyJwt, extractToken } from '../config/jwt'
import type { UserRole } from '../types'

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const token = extractToken(req.cookies?.auth_token, req.headers.authorization)

  if (!token) {
    res.status(401).json({ error: 'Não autenticado' })
    return
  }

  try {
    const payload = verifyJwt(token)
    req.user = { id: payload.sub, name: payload.name, email: payload.email, role: payload.role }
    next()
  } catch {
    res.status(401).json({ error: 'Token inválido ou expirado' })
  }
}

export function requireRole(...roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Não autenticado' })
      return
    }
    if (!roles.includes(req.user.role)) {
      res.status(403).json({ error: 'Acesso negado', required: roles, current: req.user.role })
      return
    }
    next()
  }
}

export const requireAdmin = [requireAuth, requireRole('admin')]
export const requireTechnician = [requireAuth, requireRole('admin', 'technician')]
