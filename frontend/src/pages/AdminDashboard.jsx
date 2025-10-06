import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { adminLogout } from '../services/adminService'

const AdminDashboard = () => {
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      navigate('/mcn-admin/login')
      return
    }
    async function load() {
      try {
        const { data } = await api.get('/admin/oeuvres')
        setItems(data?.data || [])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [navigate])

  async function onLogout() {
    await adminLogout()
    navigate('/mcn-admin/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Administration</h1>
          <button onClick={onLogout} className="px-3 py-2 rounded bg-gray-900 text-white hover:bg-gray-700">Se déconnecter</button>
        </div>
        {loading ? (
          <p className="text-gray-600">Chargement…</p>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 shadow">
            <div className="p-4 border-b border-gray-200 font-semibold">Œuvres</div>
            <div className="divide-y divide-gray-100">
              {items.map((it) => (
                <div key={it.id} className="p-4 flex items-center gap-4">
                  <img src={it.image_principale || it.medias?.[0]?.url || '/placeholder-artwork.svg'} alt={it.titre} className="w-16 h-16 object-cover rounded" />
                  <div>
                    <div className="font-medium text-gray-900">{it.titre}</div>
                    <div className="text-sm text-gray-600">{it.type || it.type_oeuvre || '—'}</div>
                  </div>
                </div>
              ))}
              {items.length === 0 && (
                <div className="p-4 text-gray-600">Aucune œuvre trouvée.</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard


