import React, { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle, AlertCircle, RefreshCw, X } from 'lucide-react';
import { getTickets, createTicket, deleteTicket, updateTicketEstado } from '../api/backend';
import { useAuth } from '../hooks/useAuth';

const PRIORIDADES = ['baja', 'media', 'alta', 'urgente'];
const CATEGORIAS = ['ascensor', 'filtracion', 'electricidad', 'gas', 'jardin', 'otro'];

export default function Tickets() {
  const { user, isAdmin } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [filtro, setFiltro] = useState({ estado: '', prioridad: '' });

  const [form, setForm] = useState({
    titulo: '',
    categoria: 'otro',
    descripcion: '',
    prioridad: 'media'
  });

  useEffect(() => {
    fetchTickets();
  }, [filtro, user]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const filters = { ...filtro };
      if (!isAdmin) filters.unidad = user.unidad;
      const res = await getTickets(filters);
      setTickets(res.data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTicket({ ...form, residente_id: user.id });
      setForm({ titulo: '', categoria: 'otro', descripcion: '', prioridad: 'media' });
      setShowForm(false);
      fetchTickets();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este ticket?')) return;
    try {
      await deleteTicket(id);
      fetchTickets();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChangeEstado = async (id, nuevoEstado) => {
    try {
      await updateTicketEstado(id, nuevoEstado);
      fetchTickets();
    } catch (err) {
      setError(err.message);
    }
  };

  const getPrioridadColor = (prioridad) => {
    const colors = {
      baja: 'bg-gray-100 text-gray-800',
      media: 'bg-yellow-100 text-yellow-800',
      alta: 'bg-orange-100 text-orange-800',
      urgente: 'bg-red-100 text-red-800'
    };
    return colors[prioridad] || 'bg-gray-100';
  };

  const getEstadoColor = (estado) => {
    const colors = {
      abierto: 'bg-blue-100 text-blue-800',
      en_progreso: 'bg-purple-100 text-purple-800',
      cerrado: 'bg-green-100 text-green-800'
    };
    return colors[estado] || 'bg-gray-100';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary">Mis Tickets de Mantención</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus size={20} />
          Nuevo Ticket
        </button>
      </div>

      {/* Filtros */}
      <div className="flex gap-4 flex-wrap bg-white p-4 rounded-lg shadow-sm">
        <select
          value={filtro.estado}
          onChange={(e) => setFiltro({ ...filtro, estado: e.target.value })}
          className="border border-gray-200 rounded px-3 py-2 text-sm"
        >
          <option value="">Todos los estados</option>
          <option value="abierto">Abierto</option>
          <option value="en_progreso">En Progreso</option>
          <option value="cerrado">Cerrado</option>
        </select>
        <select
          value={filtro.prioridad}
          onChange={(e) => setFiltro({ ...filtro, prioridad: e.target.value })}
          className="border border-gray-200 rounded px-3 py-2 text-sm"
        >
          <option value="">Todas las prioridades</option>
          <option value="baja">Baja</option>
          <option value="media">Media</option>
          <option value="alta">Alta</option>
          <option value="urgente">Urgente</option>
        </select>
        <button
          onClick={fetchTickets}
          className="flex items-center gap-1 text-gray-600 hover:text-primary"
        >
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Modal Formulario */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full p-6 relative">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded"
            >
              <X size={20} />
            </button>
            <h2 className="text-lg font-bold mb-4">Nuevo Ticket</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Título</label>
                <input
                  type="text"
                  required
                  value={form.titulo}
                  onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                  className="w-full border border-gray-200 rounded px-3 py-2"
                  placeholder="Ej: Filtro de agua dañado"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Categoría</label>
                <select
                  value={form.categoria}
                  onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                  className="w-full border border-gray-200 rounded px-3 py-2"
                >
                  {CATEGORIAS.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Prioridad</label>
                <select
                  value={form.prioridad}
                  onChange={(e) => setForm({ ...form, prioridad: e.target.value })}
                  className="w-full border border-gray-200 rounded px-3 py-2"
                >
                  {PRIORIDADES.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Descripción</label>
                <textarea
                  required
                  value={form.descripcion}
                  onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                  className="w-full border border-gray-200 rounded px-3 py-2 h-24"
                  placeholder="Describe el problema..."
                />
              </div>
              {error && <div className="text-red-600 text-sm">{error}</div>}
              <button
                type="submit"
                className="w-full bg-accent hover:bg-accent/90 text-white py-2 rounded font-medium"
              >
                Crear Ticket
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Detalle */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
            <button
              onClick={() => setSelectedTicket(null)}
              className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded"
            >
              <X size={20} />
            </button>
            <h2 className="text-lg font-bold mb-4">{selectedTicket.titulo}</h2>
            <div className="space-y-3 text-sm">
              <div><span className="font-medium">Categoría:</span> {selectedTicket.categoria}</div>
              <div><span className="font-medium">Descripción:</span> {selectedTicket.descripcion}</div>
              <div className="flex gap-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${getPrioridadColor(selectedTicket.prioridad)}`}>
                  {selectedTicket.prioridad}
                </span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getEstadoColor(selectedTicket.estado)}`}>
                  {selectedTicket.estado}
                </span>
              </div>
              <div><span className="font-medium">Fecha:</span> {new Date(selectedTicket.fecha_creacion).toLocaleDateString()}</div>

              {isAdmin && (
                <div className="pt-4 border-t space-y-3">
                  <select
                    value={selectedTicket.estado}
                    onChange={(e) => handleChangeEstado(selectedTicket.id, e.target.value)}
                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm"
                  >
                    <option value="abierto">Abierto</option>
                    <option value="en_progreso">En Progreso</option>
                    <option value="cerrado">Cerrado</option>
                  </select>
                  <button
                    onClick={() => { handleDelete(selectedTicket.id); setSelectedTicket(null); }}
                    className="w-full flex items-center justify-center gap-2 bg-red-100 hover:bg-red-200 text-red-800 py-2 rounded font-medium"
                  >
                    <Trash2 size={16} />
                    Eliminar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tabla */}
      {loading ? (
        <div className="text-center py-8"><RefreshCw className="animate-spin mx-auto" /></div>
      ) : tickets.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No tienes tickets registrados</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">Título</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Categoría</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Prioridad</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Estado</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map(ticket => (
                <tr
                  key={ticket.id}
                  onClick={() => setSelectedTicket(ticket)}
                  className="border-b hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3 text-sm">{ticket.titulo}</td>
                  <td className="px-4 py-3 text-sm">{ticket.categoria}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getPrioridadColor(ticket.prioridad)}`}>
                      {ticket.prioridad}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getEstadoColor(ticket.estado)}`}>
                      {ticket.estado}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">{new Date(ticket.fecha_creacion).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
