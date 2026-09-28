import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function AdminLogin() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (login(username, password)) {
      navigate('/admin')
    } else {
      setError('Invalid username or password. Try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="bg-brand-red text-white p-3 rounded-lg font-black text-2xl tracking-tighter inline-block shadow-md mb-3">
            CTN
          </div>
          <h1 className="text-xl font-serif font-extrabold text-gray-900 uppercase">Admin Panel Login</h1>
          <p className="text-xs text-gray-500 mt-1">Chitral Taiz News — Publisher Access</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-red focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-red focus:outline-none"
            />
          </div>
          {error && <p className="text-xs text-brand-red font-semibold">{error}</p>}
          <button
            type="submit"
            className="w-full bg-brand-red hover:bg-brand-darkred text-white py-2.5 rounded-lg text-sm font-bold shadow transition"
          >
            Login to Admin Panel
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-gray-100 text-center">
          <Link to="/" className="text-xs text-gray-500 hover:text-brand-red transition">
            <i className="fa-solid fa-arrow-left mr-1"></i> Back to Website
          </Link>
        </div>

        <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-3 text-[11px] text-gray-500">
          Demo credentials — <strong>admin</strong> / <strong>ctn-admin-2026</strong>
        </div>
      </div>
    </div>
  )
}
