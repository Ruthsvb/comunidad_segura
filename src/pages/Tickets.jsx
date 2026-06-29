import React, { useState } from 'react';
import { Plus, Wrench, AlertTriangle, CheckCircle, Clock, X } from 'lucide-react';
import TicketForm from '../components/TicketForm';

const MOCK_TICKETS = [
  {
    id: '#1',
    titulo: 'Ascensor',
    descripcion: 'El ascensor del bloque A se detiene en piso 3 sin razón aparente y hace ruido fuerte.',
    prioridad: 'alta',
    estado: 'En proceso',
    fecha: '15/06/2026'
  },
  {
    id: '#2',
    titulo: 'Fuga de agua',
    descripcion: 'Hay una filtración de agua en el pasillo principal del piso 1.',
    prioridad: 'urgente',
    estado: 'Abierto',
    fecha: '20/06/2026'
  },
  {
    id: '#3',
    titulo: 'Luz pasillo',
    descripcion: 'La luz del pasillo frente a mi departamento está quemada.',
    prioridad: 'baja',
    estado: 'Resuelto',
    fecha: '01/06/2026'
  }
];

export default function Tickets({ user }) {
  const [showForm, setShowForm] = useState(false);
  const [tickets, setTickets] = useState(MOCK_TICKETS);

  const handleTicketCreated = (newTicket) => {
    // Agregar ticket creado a la lista
    setTickets(prev => [{
      id: `#${newTicket.id}`,
      titulo: newTicket.titulo,
      descripcion: newTicket.descripcion,
      prioridad: newTicket.prioridad,
      estado: 'Abierto',
      fecha: new Date().toLocaleDateString('es-CL')
    }, ...prev]);
    setShowForm(false);
  };

  const getPrioridadColor = (prioridad) => {
    switch (prioridad) {
      case 'urgente': return 'border-danger text-danger bg-red-50';
      case 'alta': return 'border-warning text-warning bg-orange-50';
      case 'media': return 'border-yellow-400 text-yellow-600 bg-yellow-50';
      default: return 'border-gray-300 text-gray-500 bg-gray-50';
    }
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
              <TicketForm user={user} onSuccess={handleTicketCreated} />
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-primary">Mis Tickets de Mantención</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Nuevo Ticket
        </button>
      </div>

      <div className="space-y-4">
        {tickets.map((ticket) => (
          <div 
            key={ticket.id} 
            className={`bg-card p-5 rounded-xl border-l-4 border-y border-r border-y-gray-200 border-r-gray-200 shadow-sm flex flex-col sm:flex-row justify-between gap-4 ${getPrioridadColor(ticket.prioridad).split(' ')[0]}`}
          >
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="font-mono text-gray-500 font-bold">{ticket.id}</span>
                <h3 className="text-lg font-bold text-primary">{ticket.titulo}</h3>
                <span className={`text-xs px-2 py-0.5 rounded font-bold uppercase border ${getPrioridadColor(ticket.prioridad)}`}>
                  {ticket.prioridad}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-4">"{ticket.descripcion}"</p>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <Wrench className="w-4 h-4" />
                  Estado: <span className="text-primary">{ticket.estado}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  Creado: {ticket.fecha}
                </div>
              </div>
            </div>
            
            <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 sm:border-l border-gray-100 pt-4 sm:pt-0 sm:pl-4">
               <button className="text-secondary hover:text-secondary/80 font-medium text-sm underline-offset-2 hover:underline">
                 Ver detalle
               </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
