import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Send, CheckCircle2, AlertCircle, Clock, RefreshCw, AlertTriangle } from 'lucide-react';
import { getGastos } from '../api/n8n';

export default function Gastos({ user }) {
  const navigate = useNavigate();
  const [gastos, setGastos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGastos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getGastos(user.unidad);
      setGastos(data);
    } catch (err) {
      setError(err.message || 'No se pudieron cargar los gastos.');
      setGastos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGastos();
  }, [user]);

  const getEstadoStyles = (estado) => {
    switch (estado) {
      case 'pagado':
        return 'bg-successLight text-success border-success';
      case 'pendiente':
        return 'bg-yellow-50 text-warning border-warning';
      case 'vencido':
        return 'bg-red-50 text-danger border-danger';
      default:
        return 'bg-gray-50 text-gray-500 border-gray-200';
    }
  };

  const getEstadoIcon = (estado) => {
    switch (estado) {
      case 'pagado': return <CheckCircle2 className="w-4 h-4" />;
      case 'pendiente': return <Clock className="w-4 h-4" />;
      case 'vencido': return <AlertCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">Mis Gastos Comunes</h1>
          <p className="text-gray-500">Historial y pagos de la unidad {user.unidad}</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-full flex flex-col items-center justify-center py-10 text-gray-500">
            <RefreshCw className="w-8 h-8 text-primary animate-spin mb-4" />
            <p>Cargando gastos desde la base de datos...</p>
          </div>
        ) : error ? (
          <div className="col-span-full bg-red-50 text-danger p-6 rounded-xl flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 shrink-0" />
            <div>
              <h3 className="font-bold">Error de conexión</h3>
              <p className="text-sm mt-1">{error}</p>
              <p className="text-sm mt-2 font-mono bg-red-100/50 p-2 rounded">
                La API en n8n devolvió un error (Posiblemente el Webhook de gastos no está activo o configurado correctamente).
              </p>
            </div>
          </div>
        ) : gastos.length === 0 ? (
          <div className="col-span-full text-center py-10 text-gray-500">
            No hay registros de gastos.
          </div>
        ) : (
          gastos.map((gasto) => (
            <div key={gasto.id} className="bg-card rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-primary">{gasto.periodo || `Gasto #${gasto.id}`}</h3>
                  <p className="text-sm text-gray-500 mt-1">Vencimiento: <span className="font-mono">{gasto.vencimiento || gasto.fecha_vencimiento || 'Sin fecha'}</span></p>
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border uppercase ${getEstadoStyles(gasto.estado?.toLowerCase())}`}>
                  {getEstadoIcon(gasto.estado?.toLowerCase())}
                  {gasto.estado || 'Pendiente'}
                </div>
              </div>
              
              <div className="p-5 bg-gray-50/50">
                <h4 className="text-sm font-semibold text-gray-600 mb-3">Desglose:</h4>
                <ul className="space-y-2 text-sm text-gray-600 font-mono">
                  {Array.isArray(gasto.desglose) && gasto.desglose.length > 0 ? (
                    gasto.desglose.map((item, i) => (
                      <li key={i} className="flex justify-between border-b border-gray-200/60 pb-2 border-dotted">
                        <span>{item.item || item.concepto || item.nombre}</span>
                        <span>${(item.monto || 0).toLocaleString('es-CL')}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-400 italic">Sin desglose disponible</li>
                  )}
                </ul>
                <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between items-center">
                  <span className="font-bold text-gray-800">TOTAL</span>
                  <span className="text-lg font-bold font-mono text-primary">${(gasto.total || gasto.monto_total || 0).toLocaleString('es-CL')}</span>
                </div>
              </div>

              <div className="p-4 border-t border-gray-100 flex gap-3">
                <button 
                  onClick={() => window.open('/pdf-comprobante.pdf')}
                  className="flex-1 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 py-2 rounded-lg text-sm font-medium transition-colors flex justify-center items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Descargar PDF
                </button>
                {gasto.estado?.toLowerCase() !== 'pagado' && (
                  <button 
                    onClick={() => navigate('/pago')}
                    className="flex-1 bg-success hover:bg-success/90 text-white py-2 rounded-lg text-sm font-medium transition-colors flex justify-center items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Pagar online
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
