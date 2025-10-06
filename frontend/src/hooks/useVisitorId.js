import { useEffect, useState } from 'react'
import { createVisitor, getVisitor } from '../services/visitorService'

function generateUuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (crypto.getRandomValues(new Uint8Array(1))[0] & 0xf) >> 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export function useVisitorId() {
  const [visitorId, setVisitorId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true
    async function ensureVisitor() {
      try {
        let uuid = localStorage.getItem('visitor_uuid')
        
        // Si pas d'UUID local, en générer un
        if (!uuid) {
          uuid = generateUuid()
          localStorage.setItem('visitor_uuid', uuid)
        }

        // Essayer de créer/récupérer le visiteur côté backend
        try {
          await getVisitor(uuid)
          console.log('Visiteur existant trouvé:', uuid)
        } catch (getError) {
          console.log('Visiteur non trouvé, création...', getError)
          try {
            await createVisitor({ language: navigator.language }, uuid)
            console.log('Visiteur créé avec UUID:', uuid)
          } catch (createError) {
            console.warn('Impossible de créer le visiteur côté backend, utilisation locale:', createError)
          }
        }

        if (isMounted) setVisitorId(uuid)
      } catch (e) {
        console.error('Erreur useVisitorId:', e)
        if (isMounted) setError(e)
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    ensureVisitor()
    return () => {
      isMounted = false
    }
  }, [])

  return { visitorId, loading, error }
}



