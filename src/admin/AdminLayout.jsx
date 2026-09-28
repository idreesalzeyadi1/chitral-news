import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function AdminLayout() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/admin/login')
  }

  const linkClass = ({ isActive }) =>
    `flex items-center space-x-2 px-3 py-2.5 rounded-lg text-sm font-semibold transition ${
      isActive ? 'bg-brand-red text-white' : 'text-gray-300 hover:bg-gray-800'
    }`

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col shrink-0">
        <div className="p-5 border-b border-gray-800 flex items-center space-x-3">
          <div className="bg-brand-red text-white p-2 rounded font-black text-lg">CTN</div>
          <div>
            <div className="font-bold text-sm">Admin Panel</div>
            <div className="text-[10px] text-gray-400">Chitral Taiz News</div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <NavLink to="/admin" end className={linkClass}>
            <i className="fa-solid fa-gauge w-4"></i>
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/admin/articles" className={linkClass}>
            <i className="fa-solid fa-newspaper w-4"></i>
            <span>Manage Articles</span>
          </NavLink>
          <Link
            to="/editor/new"
            className="flex items-center space-x-2 px-3 py-2.5 rounded-lg text-sm font-semibold text-gray-300 hover:bg-gray-800 transition"
          >
            <i className="fa-solid fa-pen-nib w-4"></i>
            <span>New Article (Editor)</span>
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-800 space-y-1">
          <Link
            to="/"
            className="flex items-center space-x-2 px-3 py-2.5 rounded-lg text-sm font-semibold text-gray-300 hover:bg-gray-800 transition"
          >
            <i className="fa-solid fa-arrow-left w-4"></i>
            <span>View Website</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-2 px-3 py-2.5 rounded-lg text-sm font-semibold text-gray-300 hover:bg-brand-red hover:text-white transition"
          >
            <i className="fa-solid fa-right-from-bracket w-4"></i>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
