import React, { useState } from 'react';
import { Calendar as CalendarIcon, MapPin, Clock, Users, X } from 'lucide-react';
import ReservaForm from '../components/ReservaForm';

const MOCK_ESPACIOS = [
  { id: 1, nombre: 'Quincho', estado: 'disponible', icon: '🍖', capacidad: 20 },
  { id: 2, nombre: 'Sala de Eventos', estado: 'ocupada hoy', icon: '🎭', capacidad: 50 },
  { id: 3, nombre: 'Piscina', estado: 'disponible', icon: '🏊', capacidad: 15 },
  { id: 4, nombre: 'Cancha Multiuso', estado: 'disponible', icon: '🏃', capacidad: 10 },
];

const MOCK_RESERVAS = [
  { id: 1, espacio: 'Quincho', fecha: '05/07/2026', hora: '18:00 - 22:00', estado: 'confirmada' },
];

export default function Reservas({ user }) {
  const [showForm, setShowForm] = useState(false);
  const [reservas, setReservas] = useState(MOCK_RESERVAS);

  const handleReservaCreated = (newReserva) => {
    setReservas(prev => [{
      id: newReserva.id,
      espacio: newReserva.espacio_comun,
      fecha: new Date(newReserva.fecha_inicio).toLocaleDateString('es-CL'),
      hora: `${newReserva.hora_inicio} - ${newReserva.hora_fin}`,
      estado: newReserva.estado
    }, ...prev]);
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

      <div className="space-y-4">
        <h2 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-accent" />
          Mis Reservas
        </h2>
        {reservas.length === 0 ? (
          <div className="bg-card rounded-xl border border-gray-200 p-8 text-center text-gray-500">
            <CalendarIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No tienes reservas yet</p>
          </div>
        ) : (
          reservas.map(reserva => (
            <div key={reserva.id} className="bg-card rounded-xl border border-gray-200 p-4 shadow-sm flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-bold text-primary">{reserva.espacio}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                  <div className="flex items-center gap-1">
                    <CalendarIcon size={16} />
                    {reserva.fecha}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={16} />
                    {reserva.hora}
                  </div>
                </div>
              </div>
              <span className="text-xs bg-success/10 text-success px-3 py-1 rounded-full font-semibold capitalize">
                {reserva.estado}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
