export type UserRole = 'admin' | 'technician' | 'user'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: UserRole
}

export interface JwtPayload {
  sub: string
  name: string
  email: string
  role: UserRole
  iat?: number
  exp?: number
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser
    }
  }
}
