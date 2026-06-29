import React, { useEffect, useState } from 'react'
import { RefreshCw, CheckCircle, XCircle, AlertCircle, Clock, DollarSign, Shield } from 'lucide-react'
import { getStatus } from '../api/n8n'
import Badge from './ui/Badge'
import Spinner from './ui/Spinner'

/**
 * Componente StatusPanel con estado del sistema y servicios
 */
export default function StatusPanel() {
  const [status, setStatus] = useState(null)
  const [valorUF, setValorUF] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchStatus = async () => {
    try {
      setLoading(true)
      setError(null)
      const [statusResult, ufResult] = await Promise.all([
        getStatus(),
        fetchValorUF()
      ])
      setStatus(statusResult)
      setValorUF(ufResult)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchValorUF = async () => {
    try {
      const res = await fetch('https://mindicador.cl/api/uf')
      if (!res.ok) throw new Error('Error al obtener UF')
      const data = await res.json()
      return data.serie[0]?.valor || null
    } catch (err) {
      console.error('Error fetching UF:', err)
      return null
    }
  }

  useEffect(() => {
    fetchStatus()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-danger/10 border border-danger/20 rounded-lg p-6 text-center">
        <p className="text-danger font-medium mb-4">{error}</p>
        <button
          onClick={fetchStatus}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Reintentar
        </button>
      </div>
    )
  }

  // Adaptado al formato real del backend n8n
  const systemData = status || {}
  const isOperational = systemData.estado === 'operativo'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Estado del Sistema</h2>
          <p className="text-gray-500 mt-1">Monitoreo de servicios y componentes</p>
        </div>
        <button
          onClick={fetchStatus}
          className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors"
          title="Actualizar"
        >
          <RefreshCw size={20} />
        </button>
      </div>

      {/* Estado general */}
      <div className={`rounded-lg p-6 ${
        isOperational 
          ? 'bg-success/10 border border-success/20' 
          : 'bg-warning/10 border border-warning/20'
      }`}>
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-full ${
            isOperational ? 'bg-success' : 'bg-warning'
          }`}>
            {isOperational ? (
              <CheckCircle className="text-white" size={32} />
            ) : (
              <AlertCircle className="text-white" size={32} />
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 capitalize">
              Sistema {systemData.estado || 'Desconocido'}
            </h3>
            <p className="text-gray-600 mt-1">
              {isOperational 
                ? 'Todos los servicios funcionando correctamente' 
                : 'Algunos servicios pueden estar degradados'
              }
            </p>
          </div>
          <Badge variant={isOperational ? 'success' : 'warning'}>
            {isOperational ? 'Operativo' : 'Degradado'}
          </Badge>
        </div>
      </div>

      {/* Servicios individuales */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Estado de Servicios</h3>
        <div className="space-y-4">
          {/* Chatbot */}
          <ServiceStatus
            name="Chatbot IA"
            status={systemData.servicios?.chatbot}
            icon={<Shield size={20} />}
          />
          
          {/* Base de datos */}
          <ServiceStatus
            name="Base de Datos"
            status={systemData.servicios?.baseDatos}
            icon={<Shield size={20} />}
          />
          
          {/* API UF */}
          <ServiceStatus
            name="API UF (mindicador.cl)"
            status={systemData.servicios?.apiUF}
            icon={<DollarSign size={20} />}
          />
          
          {/* Guardrails */}
          <ServiceStatus
            name="Guardrails de Seguridad"
            status={systemData.servicios?.guardrails}
            icon={<Shield size={20} />}
          />
        </div>
      </div>

      {/* Información adicional */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Valor UF */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <DollarSign className="text-primary" size={24} />
            </div>
            <h3 className="font-semibold text-gray-900">Valor UF del día</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900 font-mono">
            ${valorUF ? valorUF.toLocaleString('es-CL') : 'N/A'}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Fuente: mindicador.cl
          </p>
        </div>

        {/* Última actualización */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Clock className="text-primary" size={24} />
            </div>
            <h3 className="font-semibold text-gray-900">Última Actualización</h3>
          </div>
          <p className="text-lg font-medium text-gray-900 font-mono">
            {systemData.timestamp 
              ? new Date(systemData.timestamp).toLocaleString('es-CL')
              : 'N/A'
            }
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Timestamp del sistema
          </p>
        </div>
      </div>

      {/* Reglas activas */}
      {systemData.reglas && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Reglas del Sistema</h3>
          <ul className="space-y-2">
            <li className="flex items-start gap-2 text-sm text-gray-600">
              <span className="text-success mt-0.5">•</span>
              <span>Anticipación de reservas: {systemData.reglas.anticipacionReservas}</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-600">
              <span className="text-success mt-0.5">•</span>
              <span>SLA tickets urgentes: {systemData.reglas.slaUrgente}</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-600">
              <span className="text-success mt-0.5">•</span>
              <span>Multa por atraso: {systemData.reglas.multaPorAtraso}</span>
            </li>
          </ul>
        </div>
      )}

      {/* Información de gastos comunes */}
      {systemData.gastosComunes && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Gastos Comunes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Estado multa</p>
              <p className="font-semibold text-gray-900">
                {systemData.gastosComunes.multaActiva ? 'Activa' : 'Inactiva'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Próximo vencimiento</p>
              <p className="font-semibold text-gray-900 font-mono">
                {systemData.gastosComunes.proximoVencimiento}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Días hasta vencimiento</p>
              <p className="font-semibold text-gray-900 font-mono">
                {systemData.gastosComunes.diasHastaVencimiento}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Turno conserje</p>
              <p className="font-semibold text-gray-900 capitalize">
                {systemData.turnoConserje}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Subcomponente para mostrar estado de un servicio individual
 */
function ServiceStatus({ name, status, icon }) {
  const isActive = status === 'activo' || status === true
  
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${isActive ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
          {icon}
        </div>
        <div>
          <p className="font-medium text-gray-900">{name}</p>
          <p className="text-sm text-gray-500 capitalize">{status || 'desconocido'}</p>
        </div>
      </div>
      <Badge variant={isActive ? 'success' : 'danger'}>
        {isActive ? 'Activo' : 'Inactivo'}
      </Badge>
    </div>
  )
}
