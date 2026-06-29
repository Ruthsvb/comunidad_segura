import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Receipt, Ticket, CalendarDays, AlertTriangle, Menu, X, LogOut } from 'lucide-react';
import ChatBot from './ChatBot';

const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/gastos', label: 'Mis Gastos', icon: Receipt },
  { path: '/tickets', label: 'Mis Tickets', icon: Ticket },
  { path: '/reservas', label: 'Reservas', icon: CalendarDays },
  { path: '/reclamos', label: 'Reclamos', icon: AlertTriangle },
];

export default function Layout({ children, user, onLogout }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-gradient-to-b from-[#111827] via-primary to-[#0f172a] text-white shadow-2xl border-r border-white/5">
      <div className="p-6 relative overflow-hidden">
        {/* Decorative background shape */}
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-accent/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 bg-secondary/20 rounded-full blur-2xl"></div>
        
        <div className="relative z-10">
          <h1 className="text-xl font-black flex items-center gap-3 mb-4 tracking-tight">
            <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain drop-shadow-md" onError={(e) => { e.target.onerror = null; e.target.style.display = 'none' }} />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">COMUNIDAD<br/>SEGURA</span>
          </h1>
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-3 border border-white/10 shadow-inner">
            <p className="font-bold text-accent text-sm">{user.user_name}</p>
            <p className="text-xs text-gray-300 font-mono mt-0.5">Unidad {user.unidad}</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 px-4 py-2 space-y-1.5 overflow-y-auto scrollbar-thin">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => setIsSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group relative ${
                isActive 
                  ? 'bg-gradient-to-r from-secondary/80 to-secondary text-white font-semibold shadow-lg shadow-secondary/20 translate-x-1' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white hover:translate-x-1'
              }`
            }
          >
            <item.icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110`} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 bg-black/20 backdrop-blur-sm border-t border-white/5">
        <button 
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 px-4 py-3 w-full rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all font-medium group"
        >
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Cerrar Sesión
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:block w-[260px] fixed h-screen z-20">
        <SidebarContent />
      </aside>

      {/* Mobile/Tablet Header & Overlay */}
      <div className="lg:hidden">
        <header className="fixed top-0 left-0 right-0 h-16 bg-primary text-white flex items-center justify-between px-4 z-30">
          <h1 className="text-lg font-bold flex items-center gap-2">
            <span className="text-accent">🛡️</span> CS
          </h1>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2">
            {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </header>
        
        {/* Mobile Sidebar */}
        <div 
          className={`fixed inset-y-0 left-0 w-[260px] z-40 transform transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <SidebarContent />
        </div>
        
        {/* Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </div>

      {/* Main Content */}
      <main className="flex-1 lg:ml-[260px] pt-16 lg:pt-0 min-h-screen flex flex-col">
        <div className="flex-1 p-4 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>

      {/* Floating Chat */}
      <ChatBot user={user} />
    </div>
  );
}
