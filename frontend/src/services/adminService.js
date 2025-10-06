import api from './api'

export async function adminLogin(email, password) {
  const { data } = await api.post('/admin/login', { email, password })
  const token = data?.data?.token
  if (token) {
    localStorage.setItem('auth_token', token)
  }
  return data
}

export async function adminLogout() {
  try {
    await api.post('/admin/logout')
  } finally {
    localStorage.removeItem('auth_token')
  }
}


