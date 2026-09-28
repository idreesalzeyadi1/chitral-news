import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import SiteLayout from './components/SiteLayout.jsx'
import Home from './pages/Home.jsx'
import CategoryPage from './pages/CategoryPage.jsx'
import AdminLogin from './admin/AdminLogin.jsx'
import AdminLayout from './admin/AdminLayout.jsx'
import AdminDashboard from './admin/AdminDashboard.jsx'
import AdminArticles from './admin/AdminArticles.jsx'
import ProtectedRoute from './admin/ProtectedRoute.jsx'
// Editor (TipTap) is heavy — load it only when an admin opens it, so the public site stays fast
const Editor = lazy(() => import('./editor/Editor.jsx'))

export default function App() {
  return (
    <Routes>
      {/* Public user-facing site */}
      <Route element={<SiteLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/category/:name" element={<CategoryPage />} />
        <Route path="*" element={<Home />} />
      </Route>

      {/* Admin auth */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Admin panel (protected) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="articles" element={<AdminArticles />} />
      </Route>

      {/* Editor panel (protected) */}
      <Route
        path="/editor/new"
        element={
          <ProtectedRoute>
            <Suspense fallback={<div className="p-10 text-center text-gray-500">Loading editor...</div>}>
              <Editor />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/editor/:id"
        element={
          <ProtectedRoute>
            <Suspense fallback={<div className="p-10 text-center text-gray-500">Loading editor...</div>}>
              <Editor />
            </Suspense>
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}
