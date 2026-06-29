import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, MapPin, Clock, Users, X, RefreshCw, AlertTriangle } from 'lucide-react';
import ReservaForm from '../components/ReservaForm';
import { getReservas } from '../api/n8n';

const MOCK_ESPACIOS = [
  { id: 1, nombre: 'Quincho', estado: 'disponible', icon: '🍖', capacidad: 20 },
  { id: 2, nombre: 'Sala de Eventos', estado: 'ocupada hoy', icon: '🎭', capacidad: 50 },
  { id: 3, nombre: 'Piscina', estado: 'disponible', icon: '🏊', capacidad: 15 },
  { id: 4, nombre: 'Cancha Multiuso', estado: 'disponible', icon: '🏃', capacidad: 10 },
];

export default function Reservas({ user }) {
  const [showForm, setShowForm] = useState(false);
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReservas = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getReservas();
      
      // Aplicar regla de negocio: 
      // Admin ve todo, residente ve solo sus reservas (basado en residente_id)
      const reservasFiltradas = data.filter(reserva => {
        if (user.role === 'admin') return true;
        // Asumiendo que el campo en la BD es residente_id o id_residente
        return reserva.residente_id === user.residente_id;
      });
      
      setReservas(reservasFiltradas);
    } catch (err) {
      setError(err.message || 'No se pudieron cargar las reservas de la base de datos.');
      setReservas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservas();
  }, [user]);

  const handleReservaCreated = (newReserva) => {
    // Al crear exitosamente, volvemos a buscar a la base de datos para asegurar consistencia
    fetchReservas();
    setShowForm(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
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
              <ReservaForm user={user} onSuccess={handleReservaCreated} />
            </div>
          </div>
        </div>
      )}

      <header className="mb-8">
        <h1 className="text-2xl font-bold text-primary">Reservas de Espacios</h1>
        <p className="text-gray-500">Consulta disponibilidad y reserva áreas comunes</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {MOCK_ESPACIOS.map((espacio) => (
          <div key={espacio.id} className="bg-card p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center">
            <div className="text-4xl mb-3">{espacio.icon}</div>
            <h3 className="font-bold text-primary mb-1">{espacio.nombre}</h3>
            
            <span className={`text-xs px-2 py-1 rounded-full font-semibold uppercase mb-4 ${
              espacio.estado === 'disponible' ? 'bg-successLight text-success' : 'bg-red-50 text-danger'
            }`}>
              {espacio.estado}
            </span>

            <button
              onClick={() => setShowForm(true)}
              disabled={espacio.estado !== 'disponible'}
              className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${
              espacio.estado === 'disponible'
                ? 'bg-primary text-white hover:bg-primary/90'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 cursor-not-allowed'
            }`}>
              {espacio.estado === 'disponible' ? 'Reservar' : 'Ver agenda'}
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-secondary" />
          <h2 className="font-bold text-gray-700">Mis Reservas</h2>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10 text-gray-500">
              <RefreshCw className="w-8 h-8 text-primary animate-spin mb-4" />
              <p>Cargando reservas desde la base de datos...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-danger p-6 rounded-xl flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <div>
                <h3 className="font-bold">Error de conexión</h3>
                <p className="text-sm mt-1">{error}</p>
                <p className="text-sm mt-2 font-mono bg-red-100/50 p-2 rounded">
                  La API en n8n devolvió un error (Posiblemente el Webhook de reservas no está activo o configurado correctamente).
                </p>
              </div>
            </div>
          ) : reservas.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              No tienes reservas registradas actualmente.
            </div>
          ) : (
            <div className="space-y-4">
              {reservas.map((reserva) => {
                const fechaInicio = new Date(reserva.fecha_inicio);
                const fechaFin = reserva.fecha_fin ? new Date(reserva.fecha_fin) : null;
                const fechaTexto = isNaN(fechaInicio) ? reserva.fecha || 'Fecha inválida' : fechaInicio.toLocaleDateString('es-CL');
                const horaTexto = isNaN(fechaInicio) 
                  ? reserva.hora || '' 
                  : `${fechaInicio.toLocaleTimeString('es-CL', {hour: '2-digit', minute:'2-digit'})} - ${fechaFin ? fechaFin.toLocaleTimeString('es-CL', {hour: '2-digit', minute:'2-digit'}) : '...'}`;

                return (
                  <div key={reserva.id || Math.random()} className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="mb-4 md:mb-0">
                      <h4 className="font-bold text-gray-800 flex items-center gap-2">
                        {reserva.espacio || reserva.espacio_comun || 'Espacio'}
                      </h4>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                        <span className="flex items-center gap-1"><CalendarIcon size={14} /> {fechaTexto}</span>
                        <span className="flex items-center gap-1"><Clock size={14} /> {horaTexto}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        (reserva.estado || '').toLowerCase() === 'confirmada' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {reserva.estado || 'Pendiente'}
                      </span>
                      <button className="text-danger hover:bg-red-50 p-2 rounded-lg transition-colors">
                        Cancelar
                      </button>
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
