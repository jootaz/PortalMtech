import type {
  Ticket,
  Conversation,
  Asset,
  VaultEntry,
  AuditLog,
} from '@/types'

// ── Tickets ──────────────────────────────────────────────────────────────────

export const TICKETS: Ticket[] = [
  {
    id: '1042',
    title: 'VPN não conecta após atualização do Windows',
    requester: 'Carlos Mendes',
    category: 'network',
    priority: 'high',
    status: 'open',
    assignee: 'João Carlos',
    createdAt: '20 min atrás',
    description: 'Após a atualização automática do Windows de ontem, a VPN parou de conectar.',
  },
  {
    id: '1041',
    title: 'Impressora do RH parou de funcionar',
    requester: 'Ana Souza',
    category: 'hardware',
    priority: 'high',
    status: 'in_progress',
    assignee: 'Maria Oliveira',
    createdAt: '1h atrás',
    description: 'A impressora HP LaserJet do setor de RH não está respondendo.',
  },
  {
    id: '1040',
    title: 'Acesso ao sistema ERP negado após reset de senha',
    requester: 'Pedro Lima',
    category: 'access',
    priority: 'medium',
    status: 'open',
    assignee: 'João Carlos',
    createdAt: '2h atrás',
    description: 'Após o reset de senha feito pelo RH, o acesso ao ERP foi negado.',
  },
  {
    id: '1039',
    title: 'Outlook trava ao abrir anexos em PDF',
    requester: 'Mariana Costa',
    category: 'software',
    priority: 'medium',
    status: 'in_progress',
    assignee: 'Maria Oliveira',
    createdAt: '3h atrás',
    description: 'O Outlook 365 trava e fecha ao tentar abrir qualquer PDF em anexo.',
  },
  {
    id: '1038',
    title: 'Segundo monitor não é detectado pelo notebook',
    requester: 'Roberto Faria',
    category: 'hardware',
    priority: 'low',
    status: 'closed',
    assignee: 'João Carlos',
    createdAt: '5h atrás',
    description: 'O notebook Dell não reconhece o segundo monitor via HDMI.',
  },
  {
    id: '1037',
    title: 'Instalação do Adobe Reader na estação WS-FIN-04',
    requester: 'Fernanda Rocha',
    category: 'software',
    priority: 'low',
    status: 'closed',
    assignee: 'Roberto Faria',
    createdAt: 'Ontem',
    description: 'Solicitar instalação do Adobe Reader DC na estação do financeiro.',
  },
]

// ── Conversations ─────────────────────────────────────────────────────────────

export const CONVERSATIONS: Conversation[] = [
  {
    id: 'c1',
    participantName: 'Carlos Mendes',
    participantInitials: 'CM',
    ticketId: '1042',
    ticketTitle: 'VPN corporativa',
    isOnline: true,
    lastMessage: 'A VPN ainda não conecta...',
    unread: 2,
    messages: [
      { id: 'm1', senderId: 'cm', senderName: 'Carlos Mendes', content: 'Bom dia! A VPN parou de conectar depois da atualização de ontem do Windows.', sentAt: '09:12', isMine: false },
      { id: 'm2', senderId: 'me', senderName: 'João Carlos', content: 'Entendido! Qual a mensagem de erro que aparece?', sentAt: '09:14', isMine: true },
      { id: 'm3', senderId: 'cm', senderName: 'Carlos Mendes', content: 'Aparece "Erro 789: falha na tentativa de conexão L2TP"', sentAt: '09:15', isMine: false },
      { id: 'm4', senderId: 'me', senderName: 'João Carlos', content: 'Pode ir em Painel de Controle → Rede → Adaptadores e me dizer quais aparecem ativos?', sentAt: '09:16', isMine: true },
      { id: 'm5', senderId: 'cm', senderName: 'Carlos Mendes', content: 'Tem "Ethernet", "Wi-Fi" e "Adaptador WAN Miniport (L2TP)"', sentAt: '09:18', isMine: false },
      { id: 'm6', senderId: 'me', senderName: 'João Carlos', content: 'Perfeito. Vou te enviar um script para reinstalar o driver do miniport. Aguarda um instante!', sentAt: '09:19', isMine: true },
    ],
  },
  {
    id: 'c2',
    participantName: 'Ana Souza',
    participantInitials: 'AS',
    ticketId: '1041',
    ticketTitle: 'Impressora RH',
    isOnline: true,
    lastMessage: 'Qual modelo é a impressora?',
    unread: 0,
    messages: [
      { id: 'm1', senderId: 'as', senderName: 'Ana Souza', content: 'A impressora do RH não está imprimindo nada.', sentAt: '08:50', isMine: false },
      { id: 'm2', senderId: 'me', senderName: 'João Carlos', content: 'Qual modelo é a impressora?', sentAt: '08:52', isMine: true },
    ],
  },
  {
    id: 'c3',
    participantName: 'Pedro Lima',
    participantInitials: 'PL',
    ticketId: '1040',
    ticketTitle: 'Acesso ERP',
    isOnline: false,
    lastMessage: 'Ok, vou aguardar. Obrigado!',
    unread: 0,
    messages: [
      { id: 'm1', senderId: 'pl', senderName: 'Pedro Lima', content: 'Preciso de acesso ao ERP urgente.', sentAt: '07:30', isMine: false },
      { id: 'm2', senderId: 'me', senderName: 'João Carlos', content: 'Estou verificando com o administrador do ERP. Aguarde.', sentAt: '07:35', isMine: true },
      { id: 'm3', senderId: 'pl', senderName: 'Pedro Lima', content: 'Ok, vou aguardar. Obrigado!', sentAt: '07:36', isMine: false },
    ],
  },
]

// ── Assets ────────────────────────────────────────────────────────────────────

export const ASSETS: Asset[] = [
  {
    id: 'ws-carlos-01',
    name: 'WS-CARLOS-01',
    type: 'workstation',
    status: 'online',
    specs: {
      Usuário: 'Carlos Mendes',
      Sistema: 'Windows 11 Pro',
      'RAM / Disco': '16 GB / 512 GB SSD',
      'Último acesso': 'Hoje, 09:10',
    },
    healthPercent: 88,
  },
  {
    id: 'srv-dc-01',
    name: 'SRV-DC-01',
    type: 'server',
    status: 'online',
    specs: {
      Sistema: 'Windows Server 2022',
      'CPU / RAM': 'Xeon E5 / 64 GB',
      Uptime: '127 dias',
      IP: '192.168.1.10',
    },
    healthPercent: 96,
  },
  {
    id: 'sw-andar2-01',
    name: 'SW-ANDAR2-01',
    type: 'network',
    status: 'warning',
    specs: {
      Modelo: 'Cisco SG350-28',
      'Portas ativas': '18 / 28',
      Localização: 'Rack 2º andar',
      'IP de gestão': '192.168.1.254',
    },
    healthPercent: 72,
  },
  {
    id: 'mob-dir-04',
    name: 'MOB-DIR-04',
    type: 'mobile',
    status: 'online',
    specs: {
      Usuário: 'Dir. Financeiro',
      Modelo: 'iPhone 15 Pro',
      Sistema: 'iOS 17.4',
      MDM: 'Inscrito (Jamf)',
    },
    healthPercent: 95,
  },
]

// ── Vault Entries ─────────────────────────────────────────────────────────────

export const VAULT_ENTRIES: VaultEntry[] = [
  { id: 'v1', name: 'SRV-DC-01 — Windows Server', username: 'Administrador', password: 'Adm@Server2024!', category: 'infra', url: '192.168.1.10', updatedAt: '2 dias atrás' },
  { id: 'v2', name: 'Portal Azure AD', username: 'admin@empresa.com.br', password: 'Az!P0rtal#2024', category: 'access', url: 'portal.azure.com', updatedAt: '5 dias atrás' },
  { id: 'v3', name: 'MySQL — Produção', username: 'root', password: 'Mysql$Prod789!', category: 'database', url: '192.168.1.50:3306', updatedAt: '12 dias atrás' },
  { id: 'v4', name: 'VPN corporativa — Fortinet', username: 'vpn-admin', password: 'vpn123', category: 'network', url: 'vpn.empresa.com.br', updatedAt: '1 mês atrás' },
  { id: 'v5', name: 'Wi-Fi corporativo — TI-Interno', username: 'WPA2 Enterprise', password: 'TI@WiFi2024#', category: 'network', updatedAt: '2 meses atrás' },
  { id: 'v6', name: 'PostgreSQL — Homologação', username: 'postgres', password: 'Pg$Homolog456!', category: 'database', url: '192.168.1.51:5432', updatedAt: '3 meses atrás' },
]

// ── Audit Logs ────────────────────────────────────────────────────────────────

export const AUDIT_LOGS: AuditLog[] = [
  { id: 'a1', action: 'Senha revelada — MySQL Produção', actor: 'João Carlos', actorRole: 'Analista de TI', timestamp: 'Hoje, 10:42', severity: 'danger' },
  { id: 'a2', action: 'Senha copiada — VPN Fortinet', actor: 'Maria Oliveira', actorRole: 'Analista de TI', timestamp: 'Hoje, 09:15', severity: 'warning' },
  { id: 'a3', action: 'Chamado #1042 aberto — VPN', actor: 'Carlos Mendes', actorRole: 'Usuário', timestamp: 'Hoje, 08:57', severity: 'info' },
  { id: 'a4', action: 'Nova entrada criada — Portal Azure AD', actor: 'João Carlos', actorRole: 'Analista de TI', timestamp: 'Ontem, 16:30', severity: 'info' },
  { id: 'a5', action: 'Senha atualizada — SRV-DC-01', actor: 'João Carlos', actorRole: 'Analista de TI', timestamp: 'Ontem, 14:05', severity: 'warning' },
  { id: 'a6', action: 'Senha revelada — Wi-Fi TI-Interno', actor: 'Maria Oliveira', actorRole: 'Analista de TI', timestamp: 'Ontem, 11:22', severity: 'danger' },
  { id: 'a7', action: 'Chamado #1038 concluído — Monitor', actor: 'João Carlos', actorRole: 'Analista de TI', timestamp: 'Ontem, 09:44', severity: 'info' },
]
