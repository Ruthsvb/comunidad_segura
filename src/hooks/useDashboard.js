import { useState, useEffect, useCallback } from 'react'
import { getDashboard } from '../api/n8n'

/**
 * Hook personalizado para obtener datos del dashboard con polling automático
 * @returns {Object} Estado y funciones del dashboard
 */
export default function useDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdate, setLastUpdate] = useState(null)

  // Función para cargar datos
  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await getDashboard()
      setData(result)
      setLastUpdate(new Date())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // Carga inicial
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Polling cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData()
    }, 30000)

    return () => clearInterval(interval)
  }, [fetchData])

  return {
    data,
    loading,
    error,
    lastUpdate,
    refetch: fetchData
  }
}
