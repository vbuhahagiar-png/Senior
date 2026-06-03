import axios from 'axios'

const BASE_URL = 'https://api.openagenda.com/v2'
const API_KEY = process.env.EXPO_PUBLIC_OPENAGENDA_API_KEY ?? ''

// Délai minimum entre requêtes pour respecter les limites de l'API
const DELAI_MIN_MS = 150

let dernierAppel = 0

async function throttle(): Promise<void> {
  const maintenant = Date.now()
  const attente = Math.max(0, DELAI_MIN_MS - (maintenant - dernierAppel))
  if (attente > 0) await new Promise((r) => setTimeout(r, attente))
  dernierAppel = Date.now()
}

export const openAgendaClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    Accept: 'application/json',
  },
})

openAgendaClient.interceptors.request.use(async (config) => {
  await throttle()
  config.params = { ...config.params, key: API_KEY }
  return config
})

openAgendaClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status
      if (status === 429) {
        console.warn('[OpenAgenda] Limite de requêtes atteinte, veuillez patienter.')
      } else if (status === 403) {
        console.error('[OpenAgenda] Clé API invalide ou expirée.')
      }
    }
    return Promise.reject(error)
  }
)
