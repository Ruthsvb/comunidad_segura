import React, { useState, useEffect } from 'react'
import { Search, RefreshCw } from 'lucide-react'
import { getResidentes } from '../api/backend'
import Badge from './ui/Badge'
import Spinner from './ui/Spinner'

/**
 * Componente Directorio de Residentes con búsqueda y filtros
 */
export default function Residentes() {
  const [residentes, setResidentes] = useState([])
  const [filteredResidentes, setFilteredResidentes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterTipo, setFilterTipo] = useState('todos')
  const [total, setTotal] = useState(0)

  // Cargar residentes
  const fetchResidentes = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await getResidentes()
      setResidentes(result.data || [])
      setTotal(result.total || 0)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchResidentes()
  }, [])

  // Filtrar residentes
  useEffect(() => {
    let filtered = residentes

    // Filtro por búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        r =>
          r.nombre?.toLowerCase().includes(term) ||
          r.apellido?.toLowerCase().includes(term) ||
          r.unidad?.toLowerCase().includes(term)
      )
    }

    // Filtro por tipo
    if (filterTipo !== 'todos') {
      filtered = filtered.filter(r => r.tipo_unidad === filterTipo)
    }

    setFilteredResidentes(filtered)
  }, [residentes, searchTerm, filterTipo])

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
          onClick={fetchResidentes}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Directorio de Residentes</h2>
          <p className="text-gray-500 mt-1">Gestión de residentes del condominio</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500">
            Total: <span className="font-semibold text-gray-900 font-mono">{total}</span>
          </div>
          <button
            onClick={fetchResidentes}
            className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors"
            title="Actualizar"
          >
            <RefreshCw size={20} />
          </button>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="bg-white rounded-lg shadow-sm p-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Búsqueda */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por nombre, apellido o unidad..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Filtro por tipo */}
          <select
            value={filterTipo}
            onChange={(e) => setFilterTipo(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
          >
            <option value="todos">Todos los tipos</option>
            <option value="departamento">Departamentos</option>
            <option value="local">Locales</option>
            <option value="estacionamiento">Estacionamientos</option>
          </select>
        </div>
      </div>

      {/* Tabla de residentes */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {filteredResidentes.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p className="text-lg font-medium">No se encontraron residentes</p>
            <p className="text-sm mt-1">Intenta con otros filtros de búsqueda</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Unidad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredResidentes.map((residente) => (
                  <tr key={residente.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-primary font-semibold">
                            {residente.nombre?.[0] || '?'}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {residente.nombre} {residente.apellido}
                          </div>
                          <div className="text-xs text-gray-500 font-mono">
                            ID: {residente.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-mono text-gray-900">
                        {residente.unidad}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600 capitalize">
                        {residente.tipo_unidad}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={residente.activo ? 'success' : 'neutral'}>
                        {residente.activo ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Paginación o info de resultados */}
      {filteredResidentes.length > 0 && (
        <div className="text-sm text-gray-500">
          Mostrando {filteredResidentes.length} de {total} residentes
        </div>
      )}
    </div>
  )
}
