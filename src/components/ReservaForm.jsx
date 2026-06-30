import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Loader2, Calendar } from 'lucide-react';
import { createReserva } from '../api/backend';
import Card from './ui/Card';

const ESPACIOS = [
  { value: 'quincho', label: 'Quincho' },
  { value: 'sala_multiuso', label: 'Sala Multiuso' },
  { value: 'estacionamiento_visitas', label: 'Estacionamiento Visitas' },
  { value: 'piscina', label: 'Piscina' },
  { value: 'cancha_deportiva', label: 'Cancha Deportiva' }
];

export default function ReservaForm({ user, onSuccess }) {
  const [espacio, setEspacio] = useState('quincho');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!espacio || !fechaInicio || !fechaFin) return;

    // Validar que fin > inicio
    if (new Date(fechaFin) <= new Date(fechaInicio)) {
      setMessage({ type: 'error', text: 'La fecha fin debe ser posterior a la fecha inicio' });
      return;
    }

    // Validar 48h anticipación
    const horasAnticipacion = (new Date(fechaInicio) - new Date()) / (1000 * 60 * 60);
    if (horasAnticipacion < 48) {
      setMessage({ type: 'error', text: 'Las reservas requieren 48 horas de anticipación' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const response = await createReserva({
        espacio,
        fecha_inicio: new Date(fechaInicio).toISOString(),
        fecha_fin: new Date(fechaFin).toISOString(),
        residente_id: user.residente_id
      });

      if (response.ok) {
        setMessage({ type: 'success', text: `Reserva #${response.data.id} confirmada` });
        setEspacio('quincho');
        setFechaInicio('');
        setFechaFin('');
        if (onSuccess) onSuccess(response.data);
      } else {
        setMessage({ type: 'error', text: 'Error al crear reserva' });
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
          <Calendar className="text-primary" size={20} />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Reservar Espacio</h3>
            <p className="text-sm text-gray-500 mt-1">Mínimo 48 horas de anticipación</p>
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
            Espacio
          </label>
          <select
            value={espacio}
            onChange={(e) => setEspacio(e.target.value)}
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:bg-gray-50"
          >
            {ESPACIOS.map(op => (
              <option key={op.value} value={op.value}>{op.label}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha y Hora Inicio
            </label>
            <input
              type="datetime-local"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha y Hora Fin
            </label>
            <input
              type="datetime-local"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:bg-gray-50"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={!espacio || !fechaInicio || !fechaFin || isLoading}
          className="w-full bg-primary text-white py-2.5 rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Reservando...
            </>
          ) : (
            'Confirmar Reserva'
          )}
        </button>
      </form>
    </Card>
  );
}
