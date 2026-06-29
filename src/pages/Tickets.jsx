import React, { useState, useEffect } from 'react';
import { Plus, Wrench, AlertTriangle, CheckCircle, Clock, X, RefreshCw } from 'lucide-react';
import TicketForm from '../components/TicketForm';
import { getTickets } from '../api/n8n';

export default function Tickets({ user }) {
  const [showForm, setShowForm] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTickets(user.unidad);
      setTickets(data);
    } catch (err) {
      setError(err.message || 'No se pudieron cargar los tickets.');
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [user]);

  const handleTicketCreated = (newTicket) => {
    fetchTickets();
    setShowForm(false);
  };

  const getPrioridadColor = (prioridad) => {
    switch (prioridad) {
      case 'urgente': return 'border-danger text-danger bg-red-50';
      case 'alta': return 'border-warning text-warning bg-orange-50';
      case 'media': return 'border-yellow-400 text-yellow-600 bg-yellow-50';
      default: return 'border-gray-300 text-gray-500 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in relative pb-16">

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg z-10"
            >
              <X size={20} />
            </button>
            <div className="p-6">
              <TicketForm user={user} onSuccess={handleTicketCreated} />
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-primary">Mis Tickets de Mantención</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Nuevo Ticket
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h2 className="font-bold text-gray-700">Tus Tickets</h2>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10 text-gray-500">
              <RefreshCw className="w-8 h-8 text-primary animate-spin mb-4" />
              <p>Cargando tickets desde la base de datos...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-danger p-6 rounded-xl flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <div>
                <h3 className="font-bold">Error de conexión</h3>
                <p className="text-sm mt-1">{error}</p>
                <p className="text-sm mt-2 font-mono bg-red-100/50 p-2 rounded">
                  La API en n8n devolvió un error (Posiblemente el Webhook de tickets no está activo o configurado correctamente).
                </p>
              </div>
            </div>
          ) : tickets.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              No hay tickets registrados.
            </div>
          ) : (
            <div className="space-y-4">
              {tickets.map((ticket) => {
                const fechaFormat = ticket.fecha_creacion || ticket.created_at 
                  ? new Date(ticket.fecha_creacion || ticket.created_at).toLocaleDateString('es-CL') 
                  : (ticket.fecha || 'Sin fecha');

                return (
                  <div key={ticket.id} className="border border-gray-200 rounded-xl p-5 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-sm font-mono text-gray-500 font-semibold uppercase">#{ticket.id}</span>
                          <h3 className="font-bold text-gray-800 text-lg">{ticket.titulo || 'Sin título'}</h3>
                          <span className={`px-2.5 py-1 text-[10px] font-black uppercase rounded-full border ${getPrioridadColor(ticket.prioridad?.toLowerCase())}`}>
                            {ticket.prioridad || 'normal'}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                          {ticket.descripcion || 'Sin descripción'}
                        </p>
                        <div className="flex items-center gap-4 text-xs font-semibold text-gray-500">
                          <span className="flex items-center gap-1.5 bg-gray-100 px-2 py-1 rounded-md">
                            <Clock size={14} /> {fechaFormat}
                          </span>
                          <span className="flex items-center gap-1.5 bg-gray-100 px-2 py-1 rounded-md capitalize">
                            <CheckCircle size={14} className={ticket.estado?.toLowerCase() === 'resuelto' ? 'text-success' : 'text-gray-400'} />
                            {ticket.estado || 'Abierto'}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 min-w-[120px]">
                        <button className="w-full bg-white border border-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                          Ver detalles
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
