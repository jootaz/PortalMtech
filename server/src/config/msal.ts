import { ConfidentialClientApplication, type Configuration } from '@azure/msal-node'
import { env } from './env'

const msalConfig: Configuration = {
  auth: {
    clientId: env.AZURE_CLIENT_ID,
    clientSecret: env.AZURE_CLIENT_SECRET,
    authority: `https://login.microsoftonline.com/${env.AZURE_TENANT_ID}`,
  },
}

export const msalClient = new ConfidentialClientApplication(msalConfig)
export const MSAL_SCOPES = ['openid', 'profile', 'email', 'User.Read']
