import React, { useState, useEffect } from 'react';
import { AlertTriangle, RefreshCw, X } from 'lucide-react';
import { getGastos, updateGastoEstadoPago, getDashboard } from '../api/backend';
import { useAuth } from '../hooks/useAuth';

export default function Gastos() {
  const { user, isAdmin } = useAuth();
  const [gastos, setGastos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGasto, setSelectedGasto] = useState(null);
  const [multa, setMulta] = useState(false);

  useEffect(() => {
    fetchGastos();
    fetchDashboard();
  }, [user]);

  const fetchGastos = async () => {
    try {
      setLoading(true);
      const filters = {};
      if (!isAdmin) filters.unidad = user.unidad;
      const res = await getGastos(filters);
      setGastos(res.data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboard = async () => {
    try {
      const res = await getDashboard();
      setMulta(res.data?.multa_gastos_comunes_activa || false);
    } catch (err) {
      // silencio
    }
  };

  const handleChangeEstado = async (id, nuevoEstado) => {
    try {
      await updateGastoEstadoPago(id, nuevoEstado);
      fetchGastos();
      setSelectedGasto(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const getEstadoColor = (estado) => {
    const colors = {
      pagado: 'bg-green-100 text-green-800',
      pendiente: 'bg-yellow-100 text-yellow-800',
      vencido: 'bg-red-100 text-red-800'
    };
    return colors[estado] || 'bg-gray-100';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-primary">Mis Gastos Comunes</h1>
        <p className="text-gray-500">Historial y pagos de la unidad {user.unidad}</p>
      </div>

      {multa && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 flex gap-3">
          <AlertTriangle className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="font-bold text-yellow-800">Período de Multa Activo</h3>
            <p className="text-sm text-yellow-700">Se aplica recargo de 1.5% por pago fuera de plazo.</p>
          </div>
        </div>
      )}

      {/* Modal Detalle */}
      {selectedGasto && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
            <button
              onClick={() => setSelectedGasto(null)}
              className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded"
            >
              <X size={20} />
            </button>
            <h2 className="text-lg font-bold mb-4">{selectedGasto.periodo}</h2>
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-medium block">Total CLP</span>
                  <div className="text-lg font-bold text-primary">${selectedGasto.monto_total_clp?.toLocaleString()}</div>
                </div>
                <div>
                  <span className="font-medium block">Total UF</span>
                  <div className="text-lg font-bold text-primary">{selectedGasto.monto_total_uf?.toFixed(2)} UF</div>
                </div>
              </div>
              <div>
                <span className="font-medium block">Estado</span>
                <span className={`inline-block mt-1 px-2 py-1 rounded text-xs font-medium ${getEstadoColor(selectedGasto.estado_pago)}`}>
                  {selectedGasto.estado_pago}
                </span>
              </div>
              <div>
                <span className="font-medium block">Vencimiento</span>
                <span className="text-gray-600">{new Date(selectedGasto.fecha_vencimiento).toLocaleDateString()}</span>
              </div>

              {selectedGasto.detalles && selectedGasto.detalles.length > 0 && (
                <div className="pt-3 border-t">
                  <span className="font-medium block mb-2">Desglose</span>
                  <ul className="space-y-1 text-xs">
                    {selectedGasto.detalles.map((det, i) => (
                      <li key={i} className="flex justify-between">
                        <span>{det.concepto}</span>
                        <span className="font-medium">${det.monto?.toLocaleString()}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {isAdmin && selectedGasto.estado_pago === 'pendiente' && (
                <button
                  onClick={() => handleChangeEstado(selectedGasto.id, 'pagado')}
                  className="w-full mt-4 bg-green-100 hover:bg-green-200 text-green-800 py-2 rounded font-medium"
                >
                  Marcar como Pagado
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tabla */}
      {loading ? (
        <div className="text-center py-8"><RefreshCw className="animate-spin mx-auto" /></div>
      ) : gastos.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No tienes gastos comunes registrados</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">Período</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Monto CLP</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Monto UF</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Estado</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Vencimiento</th>
              </tr>
            </thead>
            <tbody>
              {gastos.map(gasto => (
                <tr
                  key={gasto.id}
                  onClick={() => setSelectedGasto(gasto)}
                  className="border-b hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3 text-sm font-medium">{gasto.periodo}</td>
                  <td className="px-4 py-3 text-sm">${gasto.monto_total_clp?.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm">{gasto.monto_total_uf?.toFixed(2)} UF</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getEstadoColor(gasto.estado_pago)}`}>
                      {gasto.estado_pago}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">{new Date(gasto.fecha_vencimiento).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
