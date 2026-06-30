import React, { useState, useEffect } from 'react';
import { Plus, RefreshCw, X } from 'lucide-react';
import { getReclamos, createReclamo, updateReclamoEstado, deleteReclamo } from '../api/backend';
import { useAuth } from '../hooks/useAuth';

const TIPOS = ['ruido', 'mascota', 'estacionamiento', 'seguridad', 'otro'];

export default function Reclamos() {
  const { user, isAdmin } = useAuth();
  const [reclamos, setReclamos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedReclamo, setSelectedReclamo] = useState(null);

  const [form, setForm] = useState({
    tipo: 'ruido',
    motivo: '',
    descripcion: '',
    unidad_afectada: ''
  });

  useEffect(() => {
    fetchReclamos();
  }, [user]);

  const fetchReclamos = async () => {
    try {
      setLoading(true);
      const filters = {};
      if (!isAdmin) filters.unidad = user.unidad;
      const res = await getReclamos(filters);
      setReclamos(res.data || []);
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
      await createReclamo({ ...form, residente_id: user.id });
      setForm({ tipo: 'ruido', motivo: '', descripcion: '', unidad_afectada: '' });
      setShowForm(false);
      fetchReclamos();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChangeEstado = async (id, nuevoEstado) => {
    try {
      await updateReclamoEstado(id, nuevoEstado);
      fetchReclamos();
      setSelectedReclamo(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro?')) return;
    try {
      await deleteReclamo(id);
      fetchReclamos();
      setSelectedReclamo(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const getEstadoColor = (estado) => {
    const colors = {
      abierto: 'bg-blue-100 text-blue-800',
      en_revision: 'bg-purple-100 text-purple-800',
      resuelto: 'bg-green-100 text-green-800',
      desestimado: 'bg-gray-100 text-gray-800'
    };
    return colors[estado] || 'bg-gray-100';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary">Reclamos y Convivencia</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus size={20} />
          Nuevo Reclamo
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
            <h2 className="text-lg font-bold mb-4">Nuevo Reclamo</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tipo</label>
                <select
                  value={form.tipo}
                  onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                  className="w-full border border-gray-200 rounded px-3 py-2"
                >
                  {TIPOS.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Motivo</label>
                <input
                  type="text"
                  required
                  value={form.motivo}
                  onChange={(e) => setForm({ ...form, motivo: e.target.value })}
                  className="w-full border border-gray-200 rounded px-3 py-2"
                  placeholder="Breve motivo del reclamo"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Descripción</label>
                <textarea
                  required
                  value={form.descripcion}
                  onChange={(e) => setForm({ ...form, descripcion: e.target.value.slice(0, 500) })}
                  maxLength="500"
                  className="w-full border border-gray-200 rounded px-3 py-2 h-24"
                  placeholder="Detalla la situación (máx 500 caracteres)"
                />
                <div className="text-xs text-gray-500 mt-1">{form.descripcion.length}/500</div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Unidad Afectada (opcional)</label>
                <input
                  type="text"
                  value={form.unidad_afectada}
                  onChange={(e) => setForm({ ...form, unidad_afectada: e.target.value })}
                  className="w-full border border-gray-200 rounded px-3 py-2"
                  placeholder="Ej: 202-B"
                />
              </div>
              {error && <div className="text-red-600 text-sm">{error}</div>}
              <button
                type="submit"
                className="w-full bg-accent hover:bg-accent/90 text-white py-2 rounded font-medium"
              >
                Presentar Reclamo
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Detalle */}
      {selectedReclamo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
            <button
              onClick={() => setSelectedReclamo(null)}
              className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded"
            >
              <X size={20} />
            </button>
            <h2 className="text-lg font-bold mb-4">{selectedReclamo.motivo}</h2>
            <div className="space-y-3 text-sm">
              <div><span className="font-medium">Tipo:</span> {selectedReclamo.tipo}</div>
              <div><span className="font-medium">Descripción:</span> {selectedReclamo.descripcion}</div>
              {selectedReclamo.unidad_afectada && (
                <div><span className="font-medium">Unidad Afectada:</span> {selectedReclamo.unidad_afectada}</div>
              )}
              <div>
                <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getEstadoColor(selectedReclamo.estado)}`}>
                  {selectedReclamo.estado}
                </span>
              </div>
              <div><span className="font-medium">Fecha:</span> {new Date(selectedReclamo.fecha_creacion).toLocaleDateString()}</div>

              {isAdmin && (
                <div className="pt-4 border-t space-y-3">
                  <select
                    value={selectedReclamo.estado}
                    onChange={(e) => handleChangeEstado(selectedReclamo.id, e.target.value)}
                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm"
                  >
                    <option value="abierto">Abierto</option>
                    <option value="en_revision">En Revisión</option>
                    <option value="resuelto">Resuelto</option>
                    <option value="desestimado">Desestimado</option>
                  </select>
                  <button
                    onClick={() => handleDelete(selectedReclamo.id)}
                    className="w-full bg-red-100 hover:bg-red-200 text-red-800 py-2 rounded font-medium"
                  >
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
      ) : reclamos.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No tienes reclamos registrados</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">Tipo</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Motivo</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Estado</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {reclamos.map(reclamo => (
                <tr
                  key={reclamo.id}
                  onClick={() => setSelectedReclamo(reclamo)}
                  className="border-b hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3 text-sm font-medium">{reclamo.tipo}</td>
                  <td className="px-4 py-3 text-sm">{reclamo.motivo}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getEstadoColor(reclamo.estado)}`}>
                      {reclamo.estado}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">{new Date(reclamo.fecha_creacion).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
