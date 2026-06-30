import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { createTicket } from '../api/backend';
import Card from './ui/Card';

export default function TicketForm({ user, onSuccess }) {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [prioridad, setPrioridad] = useState('normal');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!titulo.trim() || !descripcion.trim()) return;

    setIsLoading(true);
    setMessage(null);

    try {
      const response = await createTicket({
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        prioridad,
        residente_id: user.residente_id
      });

      if (response.ok) {
        setMessage({ type: 'success', text: `Ticket #${response.data.id} creado exitosamente` });
        setTitulo('');
        setDescripcion('');
        setPrioridad('normal');
        if (onSuccess) onSuccess(response.data);
      } else {
        setMessage({ type: 'error', text: 'Error al crear ticket' });
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
        <h3 className="text-lg font-semibold text-gray-900">Crear Ticket de Mantenimiento</h3>
        <p className="text-sm text-gray-500 mt-1">Reporta un problema en tu unidad</p>
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
            Título
          </label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Ej: Grieta en pared, Llave rota..."
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:bg-gray-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Describe el problema con detalle..."
            disabled={isLoading}
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:bg-gray-50 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Prioridad
          </label>
          <select
            value={prioridad}
            onChange={(e) => setPrioridad(e.target.value)}
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:bg-gray-50"
          >
            <option value="normal">Normal</option>
            <option value="urgente">Urgente</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={!titulo.trim() || !descripcion.trim() || isLoading}
          className="w-full bg-primary text-white py-2.5 rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Creando...
            </>
          ) : (
            'Crear Ticket'
          )}
        </button>
      </form>
    </Card>
  );
}
