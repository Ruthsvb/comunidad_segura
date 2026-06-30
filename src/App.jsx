import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Gastos from './pages/Gastos';
import Tickets from './pages/Tickets';
import Reservas from './pages/Reservas';
import Reclamos from './pages/Reclamos';
import Residentes from './pages/Residentes';
import Payments from './pages/Payments';
import { login as apiLogin } from './api/backend';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await apiLogin(email, password);
      if (res.ok) {
        const userData = { ...res.resident, session_id: crypto.randomUUID() };
        localStorage.setItem('jwt_token', res.token);
        localStorage.setItem('user', JSON.stringify(userData));
        onLogin(userData);
      } else {
        setError('Credenciales inválidas');
      }
    } catch (err) {
      setError(err.message || 'Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center flex flex-col justify-center items-center p-4 relative">
      {/* Darker overlay for better contrast with glass card */}
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"></div>
      
      {/* Dark glassmorphism card */}
      <div className="w-full max-w-md bg-white/10 p-8 md:p-10 rounded-3xl shadow-2xl border border-white/20 backdrop-blur-md relative z-10 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-40 h-40 rounded-full bg-accent/30 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-40 h-40 rounded-full bg-blue-500/30 blur-3xl"></div>
        
        <div className="mb-10 text-center flex flex-col items-center relative z-10">
          <div className="relative group w-64 md:w-80">
            {/* Subtle glow behind the logo */}
            <div className="absolute inset-0 bg-white/10 blur-xl rounded-full scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <img 
              src="/logo.png" 
              alt="Comunidad Segura Logo" 
              className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-105 drop-shadow-2xl relative z-10" 
              style={{ filter: 'brightness(1.1) contrast(1.1)' }}
              onError={(e) => { e.target.onerror = null; e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96"><text y="76" font-size="76">🛡️</text></svg>' }} 
            />
          </div>
        </div>

        <form onSubmit={handleLogin} className="mb-8 relative z-10 space-y-5">
          <div className="text-center mb-6">
            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-widest drop-shadow-sm">
              Ingresar al Portal
            </h2>
          </div>
          
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-lg text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <label className="block text-slate-300 text-sm font-bold mb-2">Correo Electrónico</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/20 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent placeholder-slate-400 backdrop-blur-sm transition-all"
              placeholder="ejemplo@correo.com"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm font-bold mb-2">Contraseña</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/20 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent placeholder-slate-400 backdrop-blur-sm transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={!email || !password || loading}
            className="w-full mt-6 relative overflow-hidden group bg-accent text-white py-4 rounded-2xl font-bold text-lg shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-2xl hover:bg-[#E06512] hover:-translate-y-1 border border-white/10"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {loading ? 'Conectando...' : 'Ingresar'}
              {!loading && <span className="group-hover:translate-x-1 transition-transform">→</span>}
            </span>
          </button>
          
          <div className="pt-4 border-t border-white/10 mt-4 text-center">
            <p className="text-xs text-slate-400 mb-3">¿Ingreso de prueba?</p>
            <button
              type="button"
              onClick={() => {
                setEmail('admin@comunidad.com');
                setPassword('1234');
              }}
              className="text-sm font-semibold text-accent-light hover:text-white transition-colors bg-white/5 hover:bg-white/10 py-2 px-4 rounded-xl border border-white/10"
            >
              Autocompletar como Administrador
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <Router>
      <Layout user={user} onLogout={() => setUser(null)}>
        <Routes>
          <Route path="/" element={<Dashboard user={user} />} />
          <Route path="/gastos" element={<Gastos user={user} />} />
          <Route path="/tickets" element={<Tickets user={user} />} />
          <Route path="/reservas" element={<Reservas user={user} />} />
          <Route path="/reclamos" element={<Reclamos user={user} />} />
          <Route path="/residentes" element={<Residentes user={user} />} />
          <Route path="/pagar" element={<Payments user={user} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

