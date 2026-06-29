import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Ticket, CalendarDays, AlertTriangle, Clock, RefreshCw, AlertCircle } from 'lucide-react';
import { getDashboard } from '../api/n8n';

export default function Dashboard({ user }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = async () => {
    try {
      const res = await getDashboard();
      setData(res);
      setError(null);
    } catch (err) {
      setError('Error al conectar con el servidor.');
      // Mock fallback
      setData({
        residentes: { total: 8, activos: 8 },
        tickets: { abiertos: 3, urgentes: 1 },
        reservas: { proximas: 5 },
        reclamos: { abiertos: 3 },
        multa_activa: true,
        turno: { periodo: 'tarde', update: '12:34' }
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
    // Polling cada 30 segundos
    const interval = setInterval(fetchDashboard, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  const { residentes, tickets, reservas, reclamos, multa_activa, turno } = data || {};

  return (
    <div className="space-y-6 animate-fade-in">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-primary">
          {user.role === 'admin' ? 'Dashboard Administrativo' : `Bienvenido(a), ${user.user_name}`}
        </h1>
        <p className="text-gray-500">
          {user.role === 'admin' ? 'Resumen general de la comunidad' : `Panel de residente - Unidad ${user.unidad}`}
        </p>
      </header>

      {/* Alerta de Multa (visible para todos) */}
      {multa_activa && (
        <div className="bg-[#FFFBEB] border-l-4 border-warning p-4 rounded-r-lg flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-warning shrink-0" />
          <div>
            <h3 className="text-warning font-bold">PERÍODO DE MULTA ACTIVO — Gastos comunes vencen el día 10.</h3>
            <p className="text-warning/80 text-sm mt-1">Se aplica recargo del 1.5% por pago fuera de plazo.</p>
          </div>
        </div>
      )}

      {/* Turno Conserje (visible para todos) */}
      <div className="bg-white px-4 py-3 rounded-lg border border-gray-100 flex items-center gap-3 text-sm text-gray-600">
        <Clock className="w-5 h-5 text-gray-400" />
        <span>Turno actual: <strong className="capitalize text-primary">{turno?.periodo || 'mañana'}</strong> · Último update: {turno?.update || '12:00'}</span>
      </div>

      {user.role === 'admin' ? (
        /* VISTA ADMINISTRADOR: Métricas Globales */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          {/* Residentes */}
          <Link to="/residentes" className="block bg-gradient-to-br from-white to-blue-50/50 p-6 rounded-2xl border border-blue-100 shadow-lg shadow-blue-900/5 cursor-pointer hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity group-hover:scale-110 duration-500">
              <Users className="w-24 h-24 text-secondary" />
            </div>
            <div className="flex items-center gap-3 mb-4 text-gray-600 relative z-10">
              <div className="p-2.5 bg-blue-100 text-secondary rounded-xl">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-gray-700 tracking-wide uppercase text-sm">Residentes</h3>
            </div>
            <div className="text-4xl font-mono font-black text-primary relative z-10">{residentes?.total || 0}</div>
            <div className="flex items-center justify-between mt-2 relative z-10">
              <p className="text-sm font-semibold text-success flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
                {residentes?.activos || 0} activos
              </p>
              <span className="text-xs text-primary font-bold opacity-0 group-hover:opacity-100 transition-opacity">Ver directorio →</span>
            </div>
          </Link>

          {/* Tickets */}
          <Link to="/tickets" className={`block p-6 rounded-2xl border shadow-lg cursor-pointer hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden group ${tickets?.urgentes > 0 ? 'bg-gradient-to-br from-white to-red-50 border-red-200 shadow-red-900/10' : 'bg-gradient-to-br from-white to-orange-50 border-orange-100 shadow-orange-900/5'}`}>
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity group-hover:scale-110 duration-500">
              <Ticket className={`w-24 h-24 ${tickets?.urgentes > 0 ? 'text-danger' : 'text-warning'}`} />
            </div>
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="flex items-center gap-3 text-gray-600">
                <div className={`p-2.5 rounded-xl ${tickets?.urgentes > 0 ? 'bg-red-100 text-danger' : 'bg-orange-100 text-warning'}`}>
                  <Ticket className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-gray-700 tracking-wide uppercase text-sm">Tickets</h3>
              </div>
              {tickets?.urgentes > 0 && (
                <span className="bg-danger text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider animate-pulse">
                  {tickets.urgentes} URGENTE
                </span>
              )}
            </div>
            <div className="text-4xl font-mono font-black text-primary relative z-10">{tickets?.abiertos || 0}</div>
            <div className="flex items-center justify-between mt-2 relative z-10">
              <p className="text-sm font-semibold text-gray-500">abiertos</p>
              <span className="text-xs text-primary font-bold opacity-0 group-hover:opacity-100 transition-opacity">Ver detalles →</span>
            </div>
          </Link>

          {/* Reservas */}
          <Link to="/reservas" className="block bg-gradient-to-br from-white to-purple-50/50 p-6 rounded-2xl border border-purple-100 shadow-lg shadow-purple-900/5 cursor-pointer hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity group-hover:scale-110 duration-500">
              <CalendarDays className="w-24 h-24 text-purple-600" />
            </div>
            <div className="flex items-center gap-3 mb-4 text-gray-600 relative z-10">
              <div className="p-2.5 bg-purple-100 text-purple-600 rounded-xl">
                <CalendarDays className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-gray-700 tracking-wide uppercase text-sm">Reservas</h3>
            </div>
            <div className="text-4xl font-mono font-black text-primary relative z-10">{reservas?.proximas || 0}</div>
            <div className="flex items-center justify-between mt-2 relative z-10">
              <p className="text-sm font-semibold text-purple-600">próximas</p>
              <span className="text-xs text-primary font-bold opacity-0 group-hover:opacity-100 transition-opacity">Ver detalles →</span>
            </div>
          </Link>

          {/* Reclamos */}
          <Link to="/reclamos" className="block bg-gradient-to-br from-white to-gray-50/50 p-6 rounded-2xl border border-gray-200 shadow-lg shadow-gray-900/5 cursor-pointer hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity group-hover:scale-110 duration-500">
              <AlertTriangle className="w-24 h-24 text-gray-900" />
            </div>
            <div className="flex items-center gap-3 mb-4 text-gray-600 relative z-10">
              <div className="p-2.5 bg-gray-100 text-gray-700 rounded-xl">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-gray-700 tracking-wide uppercase text-sm">Reclamos</h3>
            </div>
            <div className="text-4xl font-mono font-black text-primary relative z-10">{reclamos?.abiertos || 0}</div>
            <div className="flex items-center justify-between mt-2 relative z-10">
              <p className="text-sm font-semibold text-gray-500">abiertos</p>
              <span className="text-xs text-primary font-bold opacity-0 group-hover:opacity-100 transition-opacity">Ver detalles →</span>
            </div>
          </Link>
        </div>
      ) : (
        /* VISTA RESIDENTE: Acciones Rápidas */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-center">
            <div className="w-16 h-16 bg-blue-50 text-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <CalendarDays className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Reservar Espacios</h3>
            <p className="text-gray-500 text-sm mb-4">Reserva el quincho, sala de eventos o cancha de tu comunidad.</p>
            <Link to="/reservas" className="inline-block bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors">
              Ir a Reservas
            </Link>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-center">
            <div className="w-16 h-16 bg-orange-50 text-warning rounded-full flex items-center justify-center mx-auto mb-4">
              <Ticket className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Solicitar Mantención</h3>
            <p className="text-gray-500 text-sm mb-4">Reporta un problema o solicita reparaciones en áreas comunes.</p>
            <Link to="/tickets" className="inline-block bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors">
              Crear Ticket
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
