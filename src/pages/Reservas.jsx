import React, { useState, useEffect } from 'react';
import { Plus, RefreshCw, X } from 'lucide-react';
import { getReservas, createReserva, updateReservaEstado, deleteReserva } from '../api/backend';
import { useAuth } from '../hooks/useAuth';

const ESPACIOS = ['quincho', 'sala_eventos', 'piscina', 'multicancha'];

export default function Reservas() {
  const { user, isAdmin } = useAuth();
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedReserva, setSelectedReserva] = useState(null);

  const [form, setForm] = useState({
    espacio_comun: 'quincho',
    fecha: '',
    hora_inicio: '',
    hora_fin: ''
  });

  useEffect(() => {
    fetchReservas();
  }, [user]);

  const fetchReservas = async () => {
    try {
      setLoading(true);
      const filters = {};
      if (!isAdmin) filters.unidad = user.unidad;
      const res = await getReservas(filters);
      setReservas(res.data || []);
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
      const fechaReserva = new Date(form.fecha);
      const ahora = new Date();
      const diff = (fechaReserva - ahora) / (1000 * 60 * 60);

      if (diff < 48) {
        setError('Mínimo 48 horas de anticipación');
        return;
      }

      await createReserva({ ...form, residente_id: user.id });
      setForm({ espacio_comun: 'quincho', fecha: '', hora_inicio: '', hora_fin: '' });
      setShowForm(false);
      fetchReservas();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancelar = async (id) => {
    if (!confirm('¿Cancelar esta reserva?')) return;
    try {
      await updateReservaEstado(id, 'cancelada');
      fetchReservas();
      setSelectedReserva(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const getEstadoColor = (estado) => {
    const colors = {
      confirmada: 'bg-green-100 text-green-800',
      pendiente: 'bg-yellow-100 text-yellow-800',
      cancelada: 'bg-red-100 text-red-800'
    };
    return colors[estado] || 'bg-gray-100';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary">Mis Reservas</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus size={20} />
          Nueva Reserva
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
            <h2 className="text-lg font-bold mb-4">Nueva Reserva</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Espacio</label>
                <select
                  value={form.espacio_comun}
                  onChange={(e) => setForm({ ...form, espacio_comun: e.target.value })}
                  className="w-full border border-gray-200 rounded px-3 py-2"
                >
                  {ESPACIOS.map(e => (
                    <option key={e} value={e}>{e}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Fecha</label>
                <input
                  type="date"
                  required
                  value={form.fecha}
                  onChange={(e) => setForm({ ...form, fecha: e.target.value })}
                  className="w-full border border-gray-200 rounded px-3 py-2"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Hora Inicio</label>
                  <input
                    type="time"
                    required
                    value={form.hora_inicio}
                    onChange={(e) => setForm({ ...form, hora_inicio: e.target.value })}
                    className="w-full border border-gray-200 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Hora Fin</label>
                  <input
                    type="time"
                    required
                    value={form.hora_fin}
                    onChange={(e) => setForm({ ...form, hora_fin: e.target.value })}
                    className="w-full border border-gray-200 rounded px-3 py-2"
                  />
                </div>
              </div>
              {error && <div className="text-red-600 text-sm">{error}</div>}
              <button
                type="submit"
                className="w-full bg-accent hover:bg-accent/90 text-white py-2 rounded font-medium"
              >
                Reservar
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Detalle */}
      {selectedReserva && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
            <button
              onClick={() => setSelectedReserva(null)}
              className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded"
            >
              <X size={20} />
            </button>
            <h2 className="text-lg font-bold mb-4">{selectedReserva.espacio_comun}</h2>
            <div className="space-y-3 text-sm">
              {isAdmin && <div><span className="font-medium">Unidad:</span> <span className="text-accent font-semibold">{selectedReserva.unidad || selectedReserva.residente?.unidad || '—'}</span></div>}
              <div><span className="font-medium">Fecha:</span> {new Date(selectedReserva.fecha).toLocaleDateString()}</div>
              <div><span className="font-medium">Hora:</span> {selectedReserva.hora_inicio} - {selectedReserva.hora_fin}</div>
              <div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getEstadoColor(selectedReserva.estado)}`}>
                  {selectedReserva.estado}
                </span>
              </div>

              {(selectedReserva.estado === 'confirmada' || selectedReserva.estado === 'pendiente') && !isAdmin && (
                <button
                  onClick={() => { handleCancelar(selectedReserva.id); }}
                  className="w-full mt-4 bg-red-100 hover:bg-red-200 text-red-800 py-2 rounded font-medium"
                >
                  Cancelar Reserva
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tabla */}
      {loading ? (
        <div className="text-center py-8"><RefreshCw className="animate-spin mx-auto" /></div>
      ) : reservas.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No tienes reservas registradas</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">Espacio</th>
                {isAdmin && <th className="px-4 py-3 text-left text-sm font-medium">Unidad</th>}
                <th className="px-4 py-3 text-left text-sm font-medium">Fecha</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Hora</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {reservas.map(reserva => (
                <tr
                  key={reserva.id}
                  onClick={() => setSelectedReserva(reserva)}
                  className="border-b hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3 text-sm font-medium">{reserva.espacio_comun}</td>
                  {isAdmin && <td className="px-4 py-3 text-sm font-medium text-accent">{reserva.residentes?.unidad || '—'}</td>}
                  <td className="px-4 py-3 text-sm">{new Date(reserva.fecha).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-sm">{reserva.hora_inicio} - {reserva.hora_fin}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getEstadoColor(reserva.estado)}`}>
                      {reserva.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
