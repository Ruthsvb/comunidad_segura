import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs';
import TicketForm from '../components/TicketForm';
import ReservaForm from '../components/ReservaForm';
import ReclamoForm from '../components/ReclamoForm';

export default function GestionarPage({ user }) {
  const handleFormSuccess = (data) => {
    // Opcional: actualizar estado, refrescar lista, etc
    console.log('Formulario exitoso:', data);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestionar Solicitudes</h1>
        <p className="text-gray-600 mt-2">Crea tickets, reservas y reclamos desde aquí</p>
      </div>

      <Tabs defaultValue="tickets" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tickets">Tickets</TabsTrigger>
          <TabsTrigger value="reservas">Reservas</TabsTrigger>
          <TabsTrigger value="reclamos">Reclamos</TabsTrigger>
        </TabsList>

        <TabsContent value="tickets" className="mt-6">
          <TicketForm user={user} onSuccess={handleFormSuccess} />
        </TabsContent>

        <TabsContent value="reservas" className="mt-6">
          <ReservaForm user={user} onSuccess={handleFormSuccess} />
        </TabsContent>

        <TabsContent value="reclamos" className="mt-6">
          <ReclamoForm user={user} onSuccess={handleFormSuccess} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
