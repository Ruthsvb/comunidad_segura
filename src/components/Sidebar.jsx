import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, MessageSquare, Users, Activity, Menu, X } from 'lucide-react'

/**
 * Componente Sidebar con navegación principal
 */
export default function Sidebar() {
  const location = useLocation()
  const [isOpen, setIsOpen] = React.useState(false)

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/residentes', label: 'Residentes', icon: Users },
    { path: '/estado', label: 'Estado del Sistema', icon: Activity },
  ]

  return (
    <>
      {/* Botón hamburguesa para móvil */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-primary text-white rounded-lg shadow-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed left-0 top-0 h-full w-64 bg-primary text-white z-40
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-0
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-success rounded-lg flex items-center justify-center font-bold text-lg">
                  CS
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full animate-pulse-slow" />
              </div>
              <div>
                <h1 className="font-bold text-lg">Comunidad</h1>
                <p className="text-xs text-white/70">Segura</p>
              </div>
            </div>
          </div>

          {/* Navegación */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                    ${isActive 
                      ? 'bg-white/10 text-white' 
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                    }
                  `}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-2 text-xs text-white/50">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
              <span>Sistema operativo</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay para móvil */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
        />
      )}
    </>
  )
}
