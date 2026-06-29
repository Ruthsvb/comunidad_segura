import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CreditCard, CheckCircle2, ShieldCheck, ArrowLeft, Loader2 } from 'lucide-react';

export default function Payments() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Extraer datos pasados por el estado de navegación (si existen)
  const { mes = 'Mes actual', monto = 0, id = '0000' } = location.state || {};

  const handlePayment = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simular procesamiento de pago de 2 segundos
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 2000);
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in text-center">
        <div className="w-24 h-24 bg-success/10 text-success rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">¡Pago Exitoso!</h1>
        <p className="text-gray-500 max-w-md mx-auto mb-8">
          Tu pago de <strong>${monto.toLocaleString('es-CL')}</strong> por los gastos comunes de <strong>{mes}</strong> ha sido procesado correctamente. El comprobante ha sido enviado a tu correo electrónico.
        </p>
        <button 
          onClick={() => navigate('/gastos')}
          className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
        >
          Volver a Mis Gastos
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in pb-10">
      <button 
        onClick={() => navigate('/gastos')}
        className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors mb-6 font-medium"
      >
        <ArrowLeft className="w-4 h-4" /> Volver
      </button>

      <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100">
        {/* Header del Pago */}
        <div className="bg-slate-900 p-8 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 bg-accent/20 rounded-full blur-3xl"></div>
          
          <h2 className="text-slate-400 font-semibold uppercase tracking-widest text-sm mb-2 relative z-10">Total a Pagar</h2>
          <div className="text-5xl font-black tracking-tight mb-2 relative z-10">
            ${monto.toLocaleString('es-CL')}
          </div>
          <p className="text-slate-300 relative z-10">Gastos Comunes - {mes}</p>
        </div>

        {/* Formulario */}
        <div className="p-8 md:p-10">
          <div className="flex items-center gap-2 text-sm text-gray-500 font-medium mb-6 bg-gray-50 p-3 rounded-lg border border-gray-100">
            <ShieldCheck className="w-5 h-5 text-success" />
            Pago 100% seguro y encriptado.
          </div>

          <form onSubmit={handlePayment} className="space-y-5">
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm">Número de Tarjeta</label>
              <div className="relative">
                <CreditCard className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="0000 0000 0000 0000" 
                  maxLength="19"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary focus:bg-white transition-colors outline-none font-mono text-gray-700 placeholder-gray-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-gray-700 font-bold mb-2 text-sm">Vencimiento</label>
                <input 
                  type="text" 
                  placeholder="MM/AA" 
                  maxLength="5"
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary focus:bg-white transition-colors outline-none text-gray-700 text-center placeholder-gray-300"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-2 text-sm">CVC</label>
                <input 
                  type="password" 
                  placeholder="•••" 
                  maxLength="4"
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary focus:bg-white transition-colors outline-none text-gray-700 text-center placeholder-gray-300 tracking-widest"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm">Nombre en la Tarjeta</label>
              <input 
                type="text" 
                placeholder="EJ: JUAN PÉREZ" 
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary focus:bg-white transition-colors outline-none text-gray-700 uppercase placeholder-gray-300"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-success hover:bg-success/90 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-success/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Procesando...
                </>
              ) : (
                <>Pagar ${monto.toLocaleString('es-CL')}</>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
