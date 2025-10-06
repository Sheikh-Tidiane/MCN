import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminLogin } from '../services/adminService'
import { motion } from 'framer-motion'
import { Lock, Mail } from 'lucide-react'

const AdminLogin = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await adminLogin(email, password)
      navigate('/mcn-admin')
    } catch (err) {
      setError('Identifiants invalides')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl p-8 border border-amber-100">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-serif font-bold text-museum-primary">Espace administration</h1>
            <p className="text-gray-600 mt-1">Connectez-vous pour gérer le contenu</p>
          </div>
          {error && <div className="mb-4 text-sm text-red-600">{error}</div>}
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Email</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-gray-400"><Mail size={16} /></span>
                <input type="email" className="w-full border rounded-lg pl-9 pr-3 py-2 focus:ring-2 focus:ring-museum-primary/60 focus:border-museum-primary" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@museum.sn" required />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Mot de passe</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-gray-400"><Lock size={16} /></span>
                <input type="password" className="w-full border rounded-lg pl-9 pr-3 py-2 focus:ring-2 focus:ring-museum-primary/60 focus:border-museum-primary" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
              </div>
            </div>
            <button disabled={loading} type="submit" className="w-full mt-2 inline-flex justify-center items-center gap-2 px-4 py-2 rounded-lg bg-museum-primary text-white hover:opacity-95 disabled:opacity-60">
              {loading ? 'Connexion…' : 'Se connecter'}
            </button>
          </form>
          <div className="mt-4 text-xs text-gray-500 text-center">Accès réservé aux administrateurs autorisés.</div>
        </div>
      </motion.div>
    </div>
  )
}

export default AdminLogin


