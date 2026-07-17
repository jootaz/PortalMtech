import jwt from 'jsonwebtoken'
import { env } from './env'
import type { AuthUser, JwtPayload } from '../types'

export function signJwt(user: AuthUser): string {
  const payload: Omit<JwtPayload, 'iat' | 'exp'> = {
    sub: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  }
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN })
}

export function verifyJwt(token: string): JwtPayload {
  return jwt.verify(token, env.JWT_SECRET) as JwtPayload
}

export function extractToken(cookieToken?: string, authHeader?: string): string | null {
  if (cookieToken) return cookieToken
  if (authHeader?.startsWith('Bearer ')) return authHeader.slice(7)
  return null
}
