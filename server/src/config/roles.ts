import type { UserRole } from '../types'

// Substitua pelos Object IDs reais dos grupos no Azure AD
// portal.azure.com → Azure Active Directory → Groups → seu grupo → Object ID
const AZURE_GROUP_TO_ROLE: Record<string, UserRole> = {
  'object-id-do-grupo-admins': 'admin',
  'object-id-do-grupo-tecnicos': 'technician',
}

export function resolveRoleFromGroups(groups: string[] = []): UserRole {
  for (const groupId of groups) {
    const role = AZURE_GROUP_TO_ROLE[groupId]
    if (role) return role
  }
  return 'user'
}

// Fallback: resolver por domínio de e-mail quando grupos não estão configurados
export function resolveRoleFromEmail(email: string): UserRole {
  const adminEmails = ['jfreire@matacompany.com']
  if (adminEmails.includes(email)) return 'admin'
  if (email.endsWith('@ti.empresa.com.br')) return 'technician'
  return 'user'
}
