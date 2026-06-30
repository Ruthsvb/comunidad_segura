import React, { useState } from 'react'
import { Users, Ticket, Calendar, AlertTriangle, Clock, DollarSign, RefreshCw, X } from 'lucide-react'
import useDashboard from '../hooks/useDashboard'
import Card from './ui/Card'
import Badge from './ui/Badge'
import Spinner from './ui/Spinner'

/**
 * Componente Dashboard principal con métricas en tiempo real
 */
export default function Dashboard() {
  const { data, loading, error, lastUpdate, refetch } = useDashboard()
  const [selectedMetric, setSelectedMetric] = useState(null)

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-danger/10 border border-danger/20 rounded-lg p-6 text-center">
        <AlertTriangle className="mx-auto mb-4 text-danger" size={32} />
        <p className="text-danger font-medium mb-4">{error}</p>
        <button
          onClick={refetch}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Reintentar
        </button>
      </div>
    )
  }

  // Datos del dashboard (viene de la API)
  const metrics = data?.data || {}

  // Determinar si hay alertas activas
  const hasUrgentTickets = metrics.tickets_urgentes > 0
  const hasMultaActiva = metrics.multa_gastos_comunes_activa

  return (
    <div className="space-y-6">
      {/* Multa Alert */}
      {hasMultaActiva && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 flex gap-3">
          <AlertTriangle className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="font-bold text-yellow-800">⚠️ Período de Multa Activo</h3>
            <p className="text-sm text-yellow-700">Se aplica recargo de 1.5% por pago fuera de plazo.</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-500 mt-1">Vista general del condominio</p>
        </div>
        <div className="flex items-center gap-4">
          {lastUpdate && (
            <div className="text-sm text-gray-500">
              Actualizado: {lastUpdate.toLocaleTimeString('es-CL')}
            </div>
          )}
          <button
            onClick={refetch}
            className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors"
            title="Actualizar"
          >
            <RefreshCw size={20} />
          </button>
        </div>
      </div>

      {/* Modal detalle */}
      {selectedMetric && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setSelectedMetric(null)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg"
            >
              <X size={20} />
            </button>
            <h2 className="text-lg font-bold text-primary mb-4">{selectedMetric.title}</h2>
            <div className="space-y-4">
              <div className="bg-primary/10 rounded-lg p-4">
                <p className="text-4xl font-bold text-primary">{selectedMetric.value}</p>
                <p className="text-sm text-gray-600 mt-2">{selectedMetric.description}</p>
              </div>
              <div className="text-sm text-gray-600 space-y-2">
                {selectedMetric.details?.map((detail, i) => (
                  <p key={i}>• {detail}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Residentes activos */}
        <Card
          className="hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => setSelectedMetric({
            title: 'Residentes Activos',
            value: metrics.total_residentes_activos || 0,
            description: 'Total de residentes registrados y activos',
            details: ['Status: Activos en el condominio', 'Últimas 24 horas: sin cambios']
          })}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-success/10 rounded-lg">
                <Users className="text-success" size={24} />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Residentes Activos</h3>
                <p className="text-3xl font-bold text-gray-900 mt-1 font-mono">
                  {metrics.total_residentes_activos || 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">Total registrados</p>
              </div>
            </div>
            <Badge variant="success">Activo</Badge>
          </div>
        </Card>

        {/* Tickets abiertos */}
        <Card
          alert={hasUrgentTickets}
          alertColor={hasUrgentTickets ? 'red' : 'amber'}
          className="hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => setSelectedMetric({
            title: 'Tickets Abiertos',
            value: metrics.tickets_abiertos || 0,
            description: 'Solicitudes de mantención pendientes',
            details: [
              `Urgentes: ${metrics.tickets_urgentes || 0}`,
              `Normales: ${(metrics.tickets_abiertos || 0) - (metrics.tickets_urgentes || 0)}`,
              'SLA Urgente: 24 horas'
            ]
          })}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-lg ${hasUrgentTickets ? 'bg-danger/10' : 'bg-warning/10'}`}>
                <Ticket className={hasUrgentTickets ? 'text-danger' : 'text-warning'} size={24} />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Tickets Abiertos</h3>
                <p className="text-3xl font-bold text-gray-900 mt-1 font-mono">
                  {metrics.tickets_abiertos || 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {hasUrgentTickets ? `${metrics.tickets_urgentes} urgentes` : 'Sin urgencias'}
                </p>
              </div>
            </div>
            <Badge variant={hasUrgentTickets ? 'danger' : 'warning'}>
              {hasUrgentTickets ? 'Urgente' : 'Pendiente'}
            </Badge>
          </div>
        </Card>

        {/* Reservas próximas */}
        <Card
          className="hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => setSelectedMetric({
            title: 'Reservas Próximas',
            value: metrics.reservas_proximas || 0,
            description: 'Espacios comunes reservados en los próximos 7 días',
            details: ['Requieren 48h de anticipación', 'Una reserva activa por unidad máximo']
          })}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Calendar className="text-primary" size={24} />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Reservas Próximas</h3>
                <p className="text-3xl font-bold text-gray-900 mt-1 font-mono">
                  {metrics.reservas_proximas || 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">Próximos 7 días</p>
              </div>
            </div>
            <Badge variant="neutral">Programado</Badge>
          </div>
        </Card>

        {/* Reclamos pendientes */}
        <Card
          className="hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => setSelectedMetric({
            title: 'Reclamos Pendientes',
            value: metrics.reclamos_pendientes || 0,
            description: 'Reclamos de convivencia por resolver',
            details: ['Estado: Pendientes de revisión', 'Seguimiento por email']
          })}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-warning/10 rounded-lg">
                <AlertTriangle className="text-warning" size={24} />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Reclamos Pendientes</h3>
                <p className="text-3xl font-bold text-gray-900 mt-1 font-mono">
                  {metrics.reclamos_pendientes || 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">Por resolver</p>
              </div>
            </div>
            <Badge variant="warning">Pendiente</Badge>
          </div>
        </Card>

        {/* Turno conserje */}
        <Card>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-success/10 rounded-lg">
                <Clock className="text-success" size={24} />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Turno Conserje</h3>
                <p className="text-2xl font-bold text-gray-900 mt-1 capitalize">
                  {metrics.turno_conserje || 'Mañana'}
                </p>
                <p className="text-xs text-gray-500 mt-1">Turno actual</p>
              </div>
            </div>
            <Badge variant="success">En servicio</Badge>
          </div>
        </Card>

        {/* Multa gastos comunes */}
        <Card alert={hasMultaActiva} alertColor="amber">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-lg ${hasMultaActiva ? 'bg-warning/10' : 'bg-success/10'}`}>
                <DollarSign className={hasMultaActiva ? 'text-warning' : 'text-success'} size={24} />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Gastos Comunes</h3>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {hasMultaActiva ? 'Con multa' : 'Al día'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Status de pagos
                </p>
              </div>
            </div>
            <Badge variant={hasMultaActiva ? 'warning' : 'success'}>
              {hasMultaActiva ? 'Multa vigente' : 'OK'}
            </Badge>
          </div>
        </Card>
      </div>

      {/* Alertas activas */}
      {(hasUrgentTickets || hasMultaActiva) && (
        <Card alert alertColor="red" className="bg-danger/5">
          <div className="flex items-start gap-4">
            <AlertTriangle className="text-danger flex-shrink-0 mt-0.5" size={24} />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">Alertas Activas</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                {hasUrgentTickets && (
                  <li>• {metrics.tickets_urgentes} tickets urgentes requieren atención</li>
                )}
                {hasMultaActiva && (
                  <li>• Multa por gastos comunes está vigente</li>
                )}
              </ul>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
