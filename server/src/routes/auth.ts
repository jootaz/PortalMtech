import { Router, type Request, type Response } from 'express'
import { msalClient, MSAL_SCOPES } from '../config/msal'
import { env } from '../config/env'
import { signJwt } from '../config/jwt'
import { resolveRoleFromGroups, resolveRoleFromEmail } from '../config/roles'
import { requireAuth } from '../middleware/requireAuth'

export const authRouter = Router()

const COOKIE_NAME = 'auth_token'
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 8 * 60 * 60 * 1000,
}

// Inicia o fluxo OAuth — redireciona para a tela de login da Microsoft
authRouter.get('/login', async (_req: Request, res: Response) => {
  try {
    const authUrl = await msalClient.getAuthCodeUrl({
      scopes: MSAL_SCOPES,
      redirectUri: env.AZURE_REDIRECT_URI,
    })
    res.redirect(authUrl)
  } catch (error) {
    console.error('[auth/login]', error)
    res.redirect(`${env.FRONTEND_URL}/login?error=auth_init_failed`)
  }
})

// Azure retorna aqui com o code; trocamos pelo token de acesso
authRouter.get('/callback', async (req: Request, res: Response) => {
  const { code, error } = req.query

  if (error || !code) {
    res.redirect(`${env.FRONTEND_URL}/login?error=azure_denied`)
    return
  }

  try {
    const tokenResponse = await msalClient.acquireTokenByCode({
      code: code as string,
      scopes: MSAL_SCOPES,
      redirectUri: env.AZURE_REDIRECT_URI,
    })

    if (!tokenResponse?.account) throw new Error('Sem dados de conta na resposta')

    const { account, idTokenClaims } = tokenResponse
    const groups = (idTokenClaims?.groups as string[]) ?? []
    const email = account.username
    const role = groups.length > 0
      ? resolveRoleFromGroups(groups)
      : resolveRoleFromEmail(email)

    const token = signJwt({
      id: account.homeAccountId,
      name: account.name ?? email,
      email,
      role,
    })

    res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS)
    res.redirect(`${env.FRONTEND_URL}/`)
  } catch (error) {
    console.error('[auth/callback]', error)
    res.redirect(`${env.FRONTEND_URL}/login?error=token_exchange_failed`)
  }
})

// Retorna dados do usuário autenticado
authRouter.get('/me', requireAuth, (req: Request, res: Response) => {
  res.json({ user: req.user })
})

// Encerra a sessão
authRouter.post('/logout', (_req: Request, res: Response) => {
  res.clearCookie(COOKIE_NAME, { httpOnly: true, secure: env.NODE_ENV === 'production', sameSite: 'lax' })
  res.json({ ok: true })
})
