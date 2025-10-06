import React, { useEffect, useState } from 'react'

const OfflineIndicator = () => {
  const [online, setOnline] = useState(navigator.onLine)

  useEffect(() => {
    function update() {
      setOnline(navigator.onLine)
    }
    window.addEventListener('online', update)
    window.addEventListener('offline', update)
    return () => {
      window.removeEventListener('online', update)
      window.removeEventListener('offline', update)
    }
  }, [])

  if (online) return null

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-amber-600 text-white shadow-lg">
      Vous êtes hors ligne. Certaines données récentes peuvent être indisponibles.
    </div>
  )
}

export default OfflineIndicator



