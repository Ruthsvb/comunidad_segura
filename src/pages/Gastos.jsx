import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Send, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

const MOCK_GASTOS = [
  {
    id: 'G-2026-06',
    periodo: 'Junio 2026',
    vencimiento: '30/06/2026',
    estado: 'pendiente',
    desglose: [
      { item: 'Aseo común', monto: 12000 },
      { item: 'Seguridad', monto: 15000 },
      { item: 'Administración', monto: 10000 },
      { item: 'Fondo de reserva', monto: 10000 }
    ],
    total: 47000
  },
  {
    id: 'G-2026-05',
    periodo: 'Mayo 2026',
    vencimiento: '30/05/2026',
    estado: 'pagado',
    desglose: [
      { item: 'Aseo común', monto: 12000 },
      { item: 'Seguridad', monto: 15000 },
      { item: 'Administración', monto: 10000 },
      { item: 'Fondo de reserva', monto: 10000 }
    ],
    total: 47000
  },
  {
    id: 'G-2026-04',
    periodo: 'Abril 2026',
    vencimiento: '30/04/2026',
    estado: 'vencido',
    desglose: [
      { item: 'Aseo común', monto: 12000 },
      { item: 'Seguridad', monto: 15000 },
      { item: 'Administración', monto: 10000 },
      { item: 'Fondo de reserva', monto: 10000 },
      { item: 'Multa atraso', monto: 705 }
    ],
    total: 47705
  }
];

export default function Gastos({ user }) {
  const navigate = useNavigate();

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
        {MOCK_GASTOS.map((gasto) => (
          <div key={gasto.id} className="bg-card rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-primary">{gasto.periodo}</h3>
                <p className="text-sm text-gray-500 mt-1">Vencimiento: <span className="font-mono">{gasto.vencimiento}</span></p>
              </div>
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border uppercase ${getEstadoStyles(gasto.estado)}`}>
                {getEstadoIcon(gasto.estado)}
                {gasto.estado}
              </div>
            </div>
            
            <div className="p-5 bg-gray-50/50">
              <h4 className="text-sm font-semibold text-gray-600 mb-3">Desglose:</h4>
              <ul className="space-y-2 text-sm text-gray-600 font-mono">
                {gasto.desglose.map((item, i) => (
                  <li key={i} className="flex justify-between border-b border-gray-200/60 pb-2 border-dotted">
                    <span>{item.item}</span>
                    <span>${item.monto.toLocaleString('es-CL')}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between items-center">
                <span className="font-bold text-gray-800">TOTAL</span>
                <span className="text-lg font-bold font-mono text-primary">${gasto.total.toLocaleString('es-CL')}</span>
              </div>
              
              {gasto.estado === 'vencido' && (
                <p className="text-danger text-xs font-bold mt-2">⚠️ Multa 1.5% activa</p>
              )}
            </div>

            <div className="p-4 border-t border-gray-100 flex gap-3">
              <button 
                onClick={(e) => {
                  const btn = e.currentTarget;
                  const originalText = btn.innerHTML;
                  btn.innerHTML = '<span class="animate-pulse">Enviando a ruthsaraiveb...</span>';
                  btn.disabled = true;
                  btn.classList.add('opacity-70');
                  
                  setTimeout(() => {
                    btn.innerHTML = '<span class="text-success flex items-center justify-center gap-2"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Enviado a ruthsaraiveb@gmail.com</span>';
                    btn.classList.remove('bg-white', 'text-gray-700', 'hover:bg-gray-50');
                    btn.classList.add('bg-success/10', 'border-success/30');
                    
                    setTimeout(() => {
                      btn.innerHTML = originalText;
                      btn.disabled = false;
                      btn.classList.remove('opacity-70', 'bg-success/10', 'border-success/30');
                      btn.classList.add('bg-white', 'text-gray-700', 'hover:bg-gray-50');
                    }, 3000);
                  }, 1500);
                }}
                className="flex-1 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 py-2 rounded-lg text-sm font-medium transition-colors flex justify-center items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Resumen al email
              </button>
              {gasto.estado !== 'pagado' && (
                <button 
                  onClick={() => navigate('/pagar', { state: { mes: gasto.periodo, monto: gasto.total, id: gasto.id } })}
                  className="flex-1 bg-success hover:bg-success/90 text-white py-2 rounded-lg text-sm font-medium transition-colors flex justify-center items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Pagar online
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
