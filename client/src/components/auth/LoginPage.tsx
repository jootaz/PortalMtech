import { useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'

function MicrosoftIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 21 21" fill="none" aria-hidden="true">
      <rect x="1" y="1" width="9" height="9" fill="#f25022" />
      <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
      <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
      <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
    </svg>
  )
}

const ERROR_MESSAGES: Record<string, string> = {
  auth_init_failed: 'Não foi possível iniciar o login. Tente novamente.',
  azure_denied: 'O acesso foi negado pelo Azure AD.',
  token_exchange_failed: 'Falha ao concluir a autenticação. Tente novamente.',
}

export function LoginPage() {
  const { login, status } = useAuth()
  const errorParam = new URLSearchParams(window.location.search).get('error')
  const errorMessage = errorParam ? ERROR_MESSAGES[errorParam] : null

  useEffect(() => {
    if (errorParam) window.history.replaceState({}, '', window.location.pathname)
  }, [errorParam])

  return (
    <div className="min-h-screen bg-surface-0 flex items-center justify-center p-4">
      <div className="bg-white border border-gray-100 rounded-2xl p-10 w-full max-w-sm text-center">
        <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center mx-auto mb-6">
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        <h1 className="text-xl font-semibold text-gray-900 mb-1">HelpDesk TI</h1>
        <p className="text-sm text-gray-400 mb-8">Portal interno — acesso restrito</p>

        {errorMessage && (
          <div className="mb-6 px-4 py-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-700 text-left">
            {errorMessage}
          </div>
        )}

        <button
          onClick={login}
          disabled={status === 'loading'}
          className="w-full flex items-center justify-center gap-3 px-4 py-3
                     bg-white border border-gray-200 rounded-xl text-sm font-medium
                     text-gray-700 hover:bg-gray-50 hover:border-gray-300
                     transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <MicrosoftIcon />
          Entrar com conta Microsoft
        </button>

        <p className="mt-8 text-xs text-gray-400">
          Use sua conta corporativa <span className="font-mono">@empresa.com.br</span>
        </p>
      </div>
    </div>
  )
}
