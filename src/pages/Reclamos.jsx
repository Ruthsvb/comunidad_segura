import React, { useState, useEffect } from 'react';
import { Plus, Volume2, Dog, Car, Shield, FileText, X, RefreshCw, AlertTriangle } from 'lucide-react';
import ReclamoForm from '../components/ReclamoForm';
import { getReclamos } from '../api/n8n';

const MOTIVOS = [
  { id: 'ruido', label: 'Ruido Molesto', icon: Volume2, color: 'text-orange-500 bg-orange-50' },
  { id: 'mascota', label: 'Mascotas', icon: Dog, color: 'text-amber-600 bg-amber-50' },
  { id: 'estacionamiento', label: 'Estacionamiento', icon: Car, color: 'text-blue-500 bg-blue-50' },
  { id: 'seguridad', label: 'Seguridad', icon: Shield, color: 'text-danger bg-red-50' },
  { id: 'otro', label: 'Otro', icon: FileText, color: 'text-gray-500 bg-gray-50' },
];

export default function Reclamos({ user }) {
  const [showForm, setShowForm] = useState(false);
  const [reclamos, setReclamos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getMotivoConfig = (id) => MOTIVOS.find(m => m.id?.toLowerCase() === (id || '').toLowerCase()) || MOTIVOS[4];

  const fetchReclamos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getReclamos(user.unidad);
      setReclamos(data);
    } catch (err) {
      setError(err.message || 'No se pudieron cargar los reclamos.');
      setReclamos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReclamos();
  }, [user]);

  const handleReclamoCreated = (newReclamo) => {
    fetchReclamos();
    setShowForm(false);
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
              <ReclamoForm user={user} onSuccess={handleReclamoCreated} />
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-primary">Reclamos y Convivencia</h1>
          <p className="text-gray-500">Reporta incidentes para mantener una buena convivencia</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors whitespace-nowrap"
        >
          <Plus size={20} />
          Nuevo Reclamo
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {MOTIVOS.map(motivo => (
          <div key={motivo.id} className="bg-card p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center justify-center text-center cursor-pointer hover:border-accent hover:shadow-md transition-all group">
            <div className={`p-3 rounded-full mb-3 group-hover:scale-110 transition-transform ${motivo.color}`}>
              <motivo.icon className="w-6 h-6" />
            </div>
            <span className="text-sm font-semibold text-gray-700">{motivo.label}</span>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex flex-col items-center justify-center py-10 text-gray-500">
            <RefreshCw className="w-8 h-8 text-primary animate-spin mb-4" />
            <p>Cargando reclamos desde la base de datos...</p>
          </div>
        ) : error ? (
          <div className="col-span-full bg-red-50 text-danger p-6 rounded-xl flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 shrink-0" />
            <div>
              <h3 className="font-bold">Error de conexión</h3>
              <p className="text-sm mt-1">{error}</p>
              <p className="text-sm mt-2 font-mono bg-red-100/50 p-2 rounded">
                La API en n8n devolvió un error (Posiblemente el Webhook de reclamos no está activo o configurado correctamente).
              </p>
            </div>
          </div>
        ) : reclamos.length === 0 ? (
          <div className="col-span-full text-center py-10 text-gray-500">
            No hay reclamos registrados.
          </div>
        ) : (
          reclamos.map((reclamo) => {
            const config = getMotivoConfig(reclamo.motivo || reclamo.tipo);
            const Icon = config.icon;
            const fechaFormat = reclamo.fecha_creacion || reclamo.created_at 
              ? new Date(reclamo.fecha_creacion || reclamo.created_at).toLocaleDateString('es-CL') 
              : (reclamo.fecha || 'Sin fecha');

            return (
              <div key={reclamo.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${config.color}`}>
                    <Icon size={24} />
                  </div>
                  <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded">
                    #{reclamo.id}
                  </span>
                </div>
                <h3 className="font-bold text-gray-800 mb-2">{config.label}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  "{reclamo.descripcion}"
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <span className="text-xs text-gray-400">{fechaFormat}</span>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                    reclamo.estado?.toLowerCase() === 'resuelto' ? 'bg-green-100 text-green-700' : 
                    reclamo.estado?.toLowerCase() === 'revisión' ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {reclamo.estado || 'Pendiente'}
                  </span>
                </div>
              </div>
            );
          })
        )}
        </div>
      </div>

    </div>
  );
}
