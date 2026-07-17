# HelpDesk TI

Portal interno de TI com chamados, chat, ativos e cofre de senhas.
Autenticação via Azure AD (conta Microsoft corporativa).

## Estrutura

```
helpdesk-ti/
├── client/          # React + TypeScript + Tailwind (frontend)
└── server/          # Node.js + Express + MSAL (backend)
```

## Pré-requisitos

- Node.js 18+
- Conta no Azure AD com permissão para registrar aplicativos

---

## 1. Configurar Azure AD

1. Acesse [portal.azure.com](https://portal.azure.com)
2. **Azure Active Directory → App registrations → New registration**
   - Nome: `HelpDesk TI`
   - Tipos de conta: **Accounts in this organizational directory only**
   - Redirect URI: `http://localhost:4000/auth/callback` (Web)
3. Copie **Application (client) ID** e **Directory (tenant) ID**
4. **Certificates & secrets → New client secret** → copie o valor
5. **API permissions → Add → Microsoft Graph → Delegated:**
   - `openid`, `profile`, `email`, `User.Read`
   - Clique em **Grant admin consent**

---

## 2. Configurar variáveis de ambiente

```bash
cd server
cp .env.example .env
```

Preencha o `.env`:
```
AZURE_CLIENT_ID=cole-aqui
AZURE_CLIENT_SECRET=cole-aqui
AZURE_TENANT_ID=cole-aqui
AZURE_REDIRECT_URI=http://localhost:4000/auth/callback
JWT_SECRET=gere-com-o-comando-abaixo
```

Gerar JWT_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 3. Instalar dependências e rodar

```bash
# Na raiz do projeto
npm install          # instala o concurrently
npm run install:all  # instala server e client

npm run dev          # inicia os dois juntos
```

- Frontend: http://localhost:5173
- Backend: http://localhost:4000

---

## Papéis de acesso (RBAC)

| Papel       | Acesso |
|-------------|--------|
| `user`      | Dashboard, Chamados, Chat |
| `technician`| + Ativos de TI |
| `admin`     | + Cofre de senhas, Log de auditoria |

Configure os papéis em `server/src/config/roles.ts` mapeando os Object IDs dos grupos do Azure AD.

## Próximos passos

- Banco de dados PostgreSQL (substituir mockData.ts por queries reais)
- WebSocket para chat em tempo real
- Criptografia AES-256 para o cofre de senhas
- Testes automatizados (Vitest + React Testing Library)
