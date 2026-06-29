import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { createReclamo } from '../api/n8n';
import Card from './ui/Card';

const TIPOS_RECLAMO = [
  { value: 'ruido', label: 'Ruido Excesivo' },
  { value: 'basura', label: 'Basura/Limpieza' },
  { value: 'mascotas', label: 'Mascotas' },
  { value: 'estacionamiento', label: 'Estacionamiento' },
  { value: 'servicios', label: 'Servicios Comunes' },
  { value: 'comportamiento', label: 'Comportamiento Residente' },
  { value: 'otro', label: 'Otro' }
];

export default function ReclamoForm({ user, onSuccess }) {
  const [tipo, setTipo] = useState('ruido');
  const [descripcion, setDescripcion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tipo || !descripcion.trim()) return;

    setIsLoading(true);
    setMessage(null);

    try {
      const response = await createReclamo({
        tipo,
        descripcion: descripcion.trim(),
        residente_id: user.residente_id
      });

      if (response.ok) {
        setMessage({ type: 'success', text: `Reclamo #${response.data.id} registrado` });
        setTipo('ruido');
        setDescripcion('');
        if (onSuccess) onSuccess(response.data);
      } else {
        setMessage({ type: 'error', text: 'Error al registrar reclamo' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="text-warning" size={20} />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Registrar Reclamo</h3>
            <p className="text-sm text-gray-500 mt-1">Reporta un problema con otros residentes o servicios</p>
          </div>
        </div>
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${
          message.type === 'success'
            ? 'bg-success/10 text-success border border-success/20'
            : 'bg-danger/10 text-danger border border-danger/20'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle size={18} />
          ) : (
            <AlertTriangle size={18} />
          )}
          <span className="text-sm font-medium">{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Reclamo
          </label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:bg-gray-50"
          >
            {TIPOS_RECLAMO.map(op => (
              <option key={op.value} value={op.value}>{op.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción Detallada
          </label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Describe la situación en detalle. Incluye fecha, hora, personas involucradas si aplica..."
            disabled={isLoading}
            rows="5"
            maxLength={500}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:bg-gray-50 resize-none"
          />
          <p className="text-xs text-gray-500 mt-1">
            {descripcion.length}/500 caracteres
          </p>
        </div>

        <button
          type="submit"
          disabled={!tipo || !descripcion.trim() || isLoading}
          className="w-full bg-primary text-white py-2.5 rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Registrando...
            </>
          ) : (
            'Registrar Reclamo'
          )}
        </button>
      </form>

      <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
        ℹ️ Tu reclamo será revisado por la administración. Recibirás seguimiento por email.
      </div>
    </Card>
  );
}
