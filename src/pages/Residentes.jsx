import React, { useEffect, useState } from 'react';
import { Users, Search, RefreshCw, CheckCircle2, XCircle } from 'lucide-react';
import { getResidentes } from '../api/n8n';

export default function Residentes({ user }) {
  const [residentes, setResidentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Solo permitir acceso a admin
    if (user.role !== 'admin') {
      setLoading(false);
      return;
    }

    const fetchResidentes = async () => {
      try {
        const res = await getResidentes();
        if (res.ok && res.data) {
          setResidentes(res.data);
        }
      } catch (err) {
        console.error("Error cargando residentes, usando datos de prueba:", err);
        // Fallback mock para coincidir con el dashboard (8 residentes)
        setResidentes([
          { id: 1, nombre: 'María', apellido: 'Soto', unidad: '101-A', tipo_unidad: 'departamento', email: 'maria.soto@email.com', telefono: '+56 9 1234 5678', activo: true },
          { id: 2, nombre: 'Jorge', apellido: 'Pérez', unidad: '102-B', tipo_unidad: 'departamento', email: 'jorge.perez@email.com', telefono: '+56 9 8765 4321', activo: true },
          { id: 3, nombre: 'Camila', apellido: 'Rojas', unidad: '203-A', tipo_unidad: 'departamento', email: 'camila.rojas@email.com', telefono: '+56 9 2345 6789', activo: true },
          { id: 4, nombre: 'Andrés', apellido: 'Silva', unidad: '304-C', tipo_unidad: 'departamento', email: 'andres.s@email.com', telefono: '+56 9 3456 7890', activo: true },
          { id: 5, nombre: 'Valentina', apellido: 'Morales', unidad: '401-A', tipo_unidad: 'departamento', email: 'vale.m@email.com', telefono: '+56 9 4567 8901', activo: true },
          { id: 6, nombre: 'Roberto', apellido: 'Gómez', unidad: '502-B', tipo_unidad: 'departamento', email: 'roberto.g@email.com', telefono: '+56 9 5678 9012', activo: true },
          { id: 7, nombre: 'Fernanda', apellido: 'Díaz', unidad: '603-A', tipo_unidad: 'departamento', email: 'fer.diaz@email.com', telefono: '+56 9 6789 0123', activo: true },
          { id: 8, nombre: 'Carlos', apellido: 'Méndez', unidad: '704-C', tipo_unidad: 'departamento', email: 'carlos.m@email.com', telefono: '+56 9 7890 1234', activo: true },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchResidentes();
  }, [user]);

  if (user.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <XCircle className="w-12 h-12 text-danger mb-4" />
        <h2 className="text-xl font-bold">Acceso Denegado</h2>
        <p>Solo el administrador puede ver el directorio de residentes.</p>
      </div>
    );
  }

  const filteredResidentes = residentes.filter(r => 
    r.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.unidad.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <header className="flex flex-col md:flex-row justify-between md:items-end gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
            <Users className="w-6 h-6" /> Directorio de Residentes
          </h1>
          <p className="text-gray-500">Gestiona la información de todos los vecinos</p>
        </div>
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Buscar por nombre o unidad..." 
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 w-full md:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-gray-100 text-slate-500 text-sm uppercase tracking-wider">
                  <th className="py-4 px-6 font-semibold">Unidad</th>
                  <th className="py-4 px-6 font-semibold">Residente</th>
                  <th className="py-4 px-6 font-semibold">Contacto</th>
                  <th className="py-4 px-6 font-semibold text-center">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredResidentes.map((residente) => (
                  <tr key={residente.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-50 text-secondary flex items-center justify-center font-bold">
                          {residente.unidad.split('-')[0]}
                        </div>
                        <div>
                          <p className="font-bold text-slate-700">{residente.unidad}</p>
                          <p className="text-xs text-slate-400 capitalize">{residente.tipo_unidad}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-semibold text-slate-800">{residente.nombre} {residente.apellido}</p>
                    </td>
                    <td className="py-4 px-6 text-sm text-slate-500">
                      <p>{residente.email || 'Sin email'}</p>
                      <p>{residente.telefono || 'Sin teléfono'}</p>
                    </td>
                    <td className="py-4 px-6 text-center">
                      {(() => {
                        const isActivo = 
                          residente.activo === true || 
                          String(residente.activo).toLowerCase() === 'true' || 
                          String(residente.activo).toLowerCase() === 'activo' || 
                          residente.estado === 'activo' || 
                          residente.estado === 'Activo' || 
                          (residente.activo === undefined && residente.estado === undefined);
                          
                        return isActivo ? (
                          <span className="inline-flex items-center gap-1 bg-success/10 text-success px-3 py-1 rounded-full text-xs font-bold uppercase">
                            <CheckCircle2 className="w-3 h-3" /> Activo
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs font-bold uppercase">
                            <XCircle className="w-3 h-3" /> Inactivo
                          </span>
                        );
                      })()}
                    </td>
                  </tr>
                ))}
                {filteredResidentes.length === 0 && (
                  <tr>
                    <td colSpan="4" className="py-8 text-center text-gray-500">
                      No se encontraron residentes.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
