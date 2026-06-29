import React, { useState } from 'react';
import { Plus, Volume2, Dog, Car, Shield, FileText, X } from 'lucide-react';
import ReclamoForm from '../components/ReclamoForm';

const MOTIVOS = [
  { id: 'ruido', label: 'Ruido Molesto', icon: Volume2, color: 'text-orange-500 bg-orange-50' },
  { id: 'mascota', label: 'Mascotas', icon: Dog, color: 'text-amber-600 bg-amber-50' },
  { id: 'estacionamiento', label: 'Estacionamiento', icon: Car, color: 'text-blue-500 bg-blue-50' },
  { id: 'seguridad', label: 'Seguridad', icon: Shield, color: 'text-danger bg-red-50' },
  { id: 'otro', label: 'Otro', icon: FileText, color: 'text-gray-500 bg-gray-50' },
];

const MOCK_RECLAMOS = [
  { id: 'R-101', motivo: 'ruido', descripcion: 'Música alta en piso 4 toda la noche.', fecha: '28/06/2026', estado: 'Revisión' }
];

export default function Reclamos({ user }) {
  const [showForm, setShowForm] = useState(false);
  const [reclamos, setReclamos] = useState(MOCK_RECLAMOS);

  const getMotivoConfig = (id) => MOTIVOS.find(m => m.id === id) || MOTIVOS[4];

  const handleReclamoCreated = (newReclamo) => {
    setReclamos(prev => [{
      id: `R-${Date.now()}`,
      motivo: newReclamo.tipo,
      descripcion: newReclamo.descripcion,
      fecha: new Date().toLocaleDateString('es-CL'),
      estado: 'Pendiente'
    }, ...prev]);
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
        <h2 className="text-lg font-bold text-primary">Mis Reclamos Recientes</h2>
        {reclamos.map(reclamo => {
          const config = getMotivoConfig(reclamo.motivo);
          return (
            <div key={reclamo.id} className="bg-card p-4 rounded-xl border border-gray-200 shadow-sm flex items-start gap-4">
              <div className={`p-2 rounded-lg ${config.color}`}>
                <config.icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-primary">{config.label}</h3>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded font-semibold text-gray-600">{reclamo.estado}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{reclamo.descripcion}</p>
                <div className="text-xs text-gray-400 mt-2 font-mono">{reclamo.fecha} · ID: {reclamo.id}</div>
              </div>
            </div>
          )
        })}
      </div>

    </div>
  );
}
