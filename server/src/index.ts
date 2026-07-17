import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { env } from './config/env'
import { authRouter } from './routes/auth'
import { requireAuth, requireAdmin, requireTechnician } from './middleware/requireAuth'

const app = express()

// ── Middlewares globais ───────────────────────────────────────────────────────
app.use(express.json())
app.use(cookieParser())
app.use(cors({ origin: env.FRONTEND_URL, credentials: true }))

// ── Autenticação (públicas) ───────────────────────────────────────────────────
app.use('/auth', authRouter)

// ── API protegida ─────────────────────────────────────────────────────────────
// Qualquer usuário autenticado
app.get('/api/tickets', requireAuth, (_req, res) => {
  res.json({ message: 'Implemente com banco de dados' })
})

// Técnicos e admins
app.post('/api/tickets', ...requireTechnician, (_req, res) => {
  res.json({ message: 'Implemente com banco de dados' })
})

// Somente admins
app.get('/api/vault', ...requireAdmin, (_req, res) => {
  res.json({ message: 'Implemente com banco de dados + AES-256' })
})

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ status: 'ok' }))

// ── Handlers de erro ──────────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ error: 'Rota não encontrada' }))

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[server]', err)
  res.status(500).json({ error: 'Erro interno do servidor' })
})

app.listen(env.PORT, () => {
  console.log(`✅ Servidor: http://localhost:${env.PORT}`)
  console.log(`   Frontend: ${env.FRONTEND_URL}`)
})
