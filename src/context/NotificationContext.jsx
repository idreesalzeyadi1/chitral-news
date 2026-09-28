import { createContext, useCallback, useContext, useState } from 'react'

const NotificationContext = createContext(null)

export function NotificationProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const notify = useCallback((msg) => {
    const id = Date.now() + Math.random()
    setToasts((t) => [...t, { id, msg }])
    setTimeout(() => {
      setToasts((t) => t.filter((toast) => toast.id !== id))
    }, 3500)
  }, [])

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[100] space-y-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="bg-gray-900 text-white px-5 py-3 rounded-xl shadow-2xl border border-gray-700 text-sm font-semibold flex items-center space-x-2 animate-in fade-in slide-in-from-bottom duration-300"
          >
            <i className="fa-solid fa-circle-check text-brand-red text-lg"></i>
            <span>{t.msg}</span>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  )
}

export function useNotify() {
  return useContext(NotificationContext).notify
}
