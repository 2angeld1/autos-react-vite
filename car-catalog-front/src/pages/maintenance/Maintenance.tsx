import toast, { Toaster } from 'react-hot-toast';

const Maintenance: React.FC = () => {
  const handleSchedule = () => {
    toast.success('¡Solicitud de cita enviada! Te contactaremos pronto.', {
      duration: 4000,
      position: 'bottom-right',
      style: {
        background: '#1F2937',
        color: '#fff',
        border: '1px solid #3B82F6',
      },
      icon: '📅',
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 pt-20">
      <Toaster />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white mb-8 flex items-center gap-3">
          <span className="p-2 bg-green-500/20 rounded-lg text-green-400">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </span>
          Mantenimiento Programado
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Status Card - Upcoming Service */}
          <div className="bg-gradient-to-br from-blue-900/50 to-gray-800 rounded-xl p-8 border border-blue-500/30 shadow-lg lg:col-span-2">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Próximo Servicio</h3>
                <p className="text-blue-200">Toyota Highlander 2021</p>
              </div>
              <div className="mt-4 md:mt-0 px-4 py-2 bg-blue-500/20 text-blue-300 rounded-full text-sm font-bold border border-blue-500/30">
                En 15 días o 500 km
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-200 bg-blue-900">
                      Estado de Aceite
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-blue-200">
                      85%
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-900/40">
                  <div style={{ width: "85%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700 flex-1 min-w-[150px]">
                  <div className="text-gray-400 text-sm mb-1">Servicio</div>
                  <div className="text-white font-semibold">Mantenimiento 10k</div>
                </div>
                <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700 flex-1 min-w-[150px]">
                  <div className="text-gray-400 text-sm mb-1">Fecha Estimada</div>
                  <div className="text-white font-semibold">15 Feb, 2026</div>
                </div>
                <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700 flex-1 min-w-[150px]">
                  <div className="text-gray-400 text-sm mb-1">Costo Est.</div>
                  <div className="text-white font-semibold">$150.00</div>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={handleSchedule}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors shadow-lg shadow-blue-600/20"
                >
                  Agendar Cita
                </button>
                <button className="bg-transparent hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-lg border border-gray-600 transition-colors">
                  Ver Detalles
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-white mb-6">Acciones Rápidas</h3>
              <div className="space-y-4">
                <button className="w-full flex items-center justify-between p-4 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors group cursor-pointer border border-transparent hover:border-gray-600">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500/20 rounded-lg text-green-400 group-hover:scale-110 transition-transform">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <span className="text-gray-200">Historial de Servicios</span>
                  </div>
                  <svg className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>

                <button className="w-full flex items-center justify-between p-4 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors group cursor-pointer border border-transparent hover:border-gray-600">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-500/20 rounded-lg text-yellow-400 group-hover:scale-110 transition-transform">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    </div>
                    <span className="text-gray-200">Alertas Activas (0)</span>
                  </div>
                  <svg className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>

                <button className="w-full flex items-center justify-between p-4 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors group cursor-pointer border border-transparent hover:border-gray-600">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400 group-hover:scale-110 transition-transform">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    </div>
                    <span className="text-gray-200">Contactar Soporte</span>
                  </div>
                  <svg className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
            </div>
            
            <div className="mt-8 bg-gray-900/50 rounded-lg p-4 border border-dashed border-gray-600">
              <p className="text-gray-400 text-sm text-center">
                ¿Necesitas ayuda urgente? <br />
                Llama al <a href="tel:5551234567" className="text-blue-400 hover:underline font-bold">555-123-4567</a>
              </p>
            </div>
          </div>
        </div>

        {/* Maintenance History */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-700 flex justify-between items-center">
            <h3 className="text-xl font-bold text-white">Historial Reciente</h3>
            <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">Ver Todo</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-900/50 text-gray-400 text-sm uppercase">
                <tr>
                  <th className="px-6 py-4 font-medium">Fecha</th>
                  <th className="px-6 py-4 font-medium">Servicio</th>
                  <th className="px-6 py-4 font-medium">Vehículo</th>
                  <th className="px-6 py-4 font-medium">Kilometraje</th>
                  <th className="px-6 py-4 font-medium">Costo</th>
                  <th className="px-6 py-4 font-medium">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700 text-gray-300">
                <tr className="hover:bg-gray-700/30 transition-colors">
                  <td className="px-6 py-4">15 Nov, 2025</td>
                  <td className="px-6 py-4 font-medium text-white">Cambio de Aceite</td>
                  <td className="px-6 py-4">Toyota Highlander</td>
                  <td className="px-6 py-4">45,000 km</td>
                  <td className="px-6 py-4">$85.00</td>
                  <td className="px-6 py-4">
                    <span className="bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-xs font-bold border border-green-500/20">
                      Completado
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-gray-700/30 transition-colors">
                  <td className="px-6 py-4">02 Oct, 2025</td>
                  <td className="px-6 py-4 font-medium text-white">Revisión Frenos</td>
                  <td className="px-6 py-4">Ford Mustang</td>
                  <td className="px-6 py-4">32,000 km</td>
                  <td className="px-6 py-4">$120.00</td>
                  <td className="px-6 py-4">
                    <span className="bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-xs font-bold border border-green-500/20">
                      Completado
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-gray-700/30 transition-colors">
                  <td className="px-6 py-4">12 Ago, 2025</td>
                  <td className="px-6 py-4 font-medium text-white">Alineación y Balanceo</td>
                  <td className="px-6 py-4">Toyota Highlander</td>
                  <td className="px-6 py-4">40,000 km</td>
                  <td className="px-6 py-4">$95.00</td>
                  <td className="px-6 py-4">
                    <span className="bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-xs font-bold border border-green-500/20">
                      Completado
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Maintenance;
